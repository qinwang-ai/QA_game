#!/usr/bin/env python
# coding=utf-8

import torndb
import time
from config.database import *
from config.base import *
from config.enum import *
from config.ans import *
from common.memory import *
import random

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

def log_decorator(func):
    """
    装饰器函数,打印出每个被装饰的函数的doc
    """
    def func_with_log(*args, **kwargs):
        print  func.__doc__
        return func(*args, **kwargs)
    return func_with_log

@log_decorator
def connect_to_db():
    """
    建立mysql连接
    """
    conn = torndb.Connection(HOSTNAME, DATABASE,
        USERNAME, PASSWORD)
    return conn 

mysql_conn = connect_to_db()

@log_decorator
def update_user_score_in_mysql(conn, token, score):
    """
    更新用用最高分数
    并返回最高的分数
    """
    conn.execute('update user set best_score=%s where token=%s and best_score<%s', score, token, score)
    return conn.get('select best_score from user where token=%s', token).best_score

def check_token(conn, token, login_name, res):
    """
    检查token
    """
    # 如果login_name 设置为None, 则说明是在非登陆验证场景下的token验证（只需要token验证）
    if not login_name:
        msg = conn.get('select 1 from user where token=%s', token) if token else None
    # 登陆验证场景下需要netid + token一起验证
    else:
        msg = conn.get('select 1 from user where token = %s and login_name=%s', token, login_name)
    if msg is None:
        set_status(res, StatusCode.INVALID_TOKEN)
        return False
    else:
        return True

def check_qtype(type, res):
    """
    检查题目类型
    """
    if type not in range(1, 5):
        set_status(res, StatusCode.INVALID_TYPE)
        return False
    return True

def check_input(login_name, login_pwd, phone_num, res): 
    """
    检查基本输入
    """
    if not (login_name and login_pwd):
        set_status(StatusCode.INVALID_USERNAME)
        return False 
    elif not phone_num:
        set_status(StatusCode.INVALID_PHONE)
        return False
    else:
        return True
 
def fetch_one(conn, type=QType.SELECT, filters=[]):  
    """
    随机选择一道没答过的题目
    """
    if isinstance(filters, list) and filters:
        filters = map(lambda e: str(e), filters)
        filters = '('+', '.join(filters)+ ')'
        sql = 'select q_id from question where `type`=%s and q_id not in %s'%(type, filters)
        q_list = conn.query(sql)
        q_list = list(q_list)
        if len(q_list) == 0: return {}
        random.shuffle(q_list) 
        random_q_id = q_list[random.randint(0, len(q_list)-1)]['q_id']
        sql = 'select q_id, note, meterial from question where q_id=%s'%random_q_id
        qu = conn.get(sql) 
    else:
        sql = 'select q_id from question where `type`=%s'%type
        q_list = conn.query(sql)
        q_list = list(q_list)
        if len(q_list) == 0: return {}
        random.shuffle(q_list) 
        random_q_id = q_list[random.randint(0, len(q_list)-1)]['q_id']
        sql = 'select q_id, note, meterial from question where q_id=%s'%random_q_id
        qu = conn.get(sql) 
    if qu is None:
        return {}

    sql = 'select o_id, note from options where q_id=%s'
    if type == QType.SELECT or type == QType.JUDGE:
        del qu['meterial']
        qu = dict(qu)
        opts = conn.query(sql, qu['q_id'])
        for index, value in enumerate(opts):
            opts[index] = dict(value)
    elif type == QType.MEMORY:
        qu = dict(qu)
        opts = conn.query(sql, qu['q_id'])
        for index, value in enumerate(opts):
            opts[index] = dict(value)
    elif type == QType.PINTU:
        del qu['meterial']
        opts = list('123456789')
        random.shuffle(opts)
        opts = ''.join(opts)
        qu = dict(qu)
    info = {
        'question': dict(qu),
        'options': opts,
    }
    return info

@log_decorator
def verify_netid(login_name, login_pwd, res):
    """
    通过教务系统验证netid
    """
    import urllib2
    import cookielib
    from lxml import etree
    import urllib
    import uuid
    # 设置cookie绑定
    cj = cookielib.CookieJar()
    opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
    urllib2.install_opener(opener)
    url = 'https://sso.sysu.edu.cn/cas/login?locale=zh_CN'
    resp = urllib2.urlopen(url)
    # 提取一些input信息
    tree = etree.HTML(resp.read())
    lt_value = tree.xpath('//input[@name="lt"]')[0].values()[-1]
    execution_value = tree.xpath('//input[@name="execution"]')[0].values()[-1]

    req = urllib2.Request(url)
    # 模拟头部信息
    req.add_header('Origin', 'https://sso.sysu.edu.cn')
    req.add_header('Accept-Encoding', 'gzip, deflate')
    req.add_header('Accept-Language', 'zh-CN,zh;q=0.8')
    req.add_header('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36')
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    req.add_header('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
    req.add_header('Cache-Control', 'max-age=0')
    req.add_header('Referer', url)
    req.add_header('Connection', 'keep-alive')

    postData = {
        'username': login_name,
        'password': login_pwd,
        'lt': lt_value,
        'execution': execution_value,
        '_eventId': 'submit',
        'code': '',
        'submit': '登录', 
    }
    postData = urllib.urlencode(postData)
    req.add_data(postData)
    resp = urllib2.urlopen(req)
    # 如果返回的内容有883个字节,说明验证通过
    if int(resp.headers['content-length']) == 883:
        return uuid.uuid1().hex
    else:
        set_status(res, StatusCode.INVALID_USERNAME)
        return None

@log_decorator
def _user_exists(conn, login_name):
    """
    判断用户是否存在
    """
    sql = 'select 1 from user where login_name=%s' 
    msg = conn.get(sql, login_name)
    return msg is not None
    
@log_decorator
def save_user(conn, login_name, phone_num, token):
    """
    如果是新用户则插入
    如果是已有用户，则更新token
    """
    if  _user_exists(conn, login_name):
        sql = 'update user set token = %s where login_name=%s'
        conn.execute(sql, token, login_name)
    else:
        sql = 'insert into user values(NULL, %s, %s, 0, 0, %s,  %s)'
        conn.execute(sql, login_name, phone_num, CampusArea.EAST ,token) 

@log_decorator
def check_times_out(conn, token, res):
    """
    检查是否超过一定的答题次数限制
    """
    sql = 'select times from user where token=%s'
    msg = conn.get(sql, token)
    if not msg.times < MAX_TIMES:
        set_status(res, StatusCode.TIMES_OUT)
        return False
    return True

@log_decorator
def add_onetime(conn, token):
    """
    用户答题次数加一
    """
    sql = 'update user set times=times+1 where token=%s'
    conn.execute(sql,token)

@log_decorator
def is_right(conn, q_id, o_id):
    """
    根据类型和题目和选项判断答案是否正确
    """
    # 如果是拼图题
    sql = 'select `type` from question where q_id=%s'
    type = conn.get(sql, q_id).get('type')
    if type == QType.PINTU:
        return str(o_id) in PINTU_ANS
    else: 
        msg = conn.get('select 1 from question where q_id=%s', q_id)
        if not msg: return False
        sql = 'select 1 from options where q_id=%s and o_id=%s and is_ans=%s'
        msg = conn.get(sql, q_id, o_id, True)
        return True if msg else False 

@log_decorator
def set_status(res, code):
    """
    设置处理状态
    """
    res['status'] = code
    res['info'] = ErrorMsg[code]


def hit_percent(conn, score):
    """
    获取当前分数打败的人数百分比
    """
    sql = 'select ((select count(*) from user where `best_score` <= %s) / (select count(*) from user)) as percent'
    return int(float(conn.get(sql, score).get('percent'))*100)


