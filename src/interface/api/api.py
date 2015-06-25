#!/usr/bin/env python
# coding=utf-8

from common.functions  import *
from config.enum import *

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

# def login(kwargs):
#     """
#     登陆接口
#     登陆验证处理,返回的一个字典，包括:
#     status表示处理状态，用于前端错误处理
#     info　错误状态码对应的错误信息描述
#     data 内容主体,包括第一道题和token
#     >>> # 没有token
#     >>> params = {  'netid': '1', 'pwd': '1', 'phone_num': '13824413780', 'token': '' }
#     >>> res = login(params)
#     >>> print res
#     >>> 
#     >>> # 错误token
#     >>> params = {  'netid': '1', 'pwd': '1', 'phone_num': '13824413780', 'token': '1' }
#     >>> res = login(params)
#     >>> print res
#     >>>
#     >>> # 正确token + login_name
#     >>> params = {  'netid': '1', 'pwd': '1', 'phone_num': '13824413780', 'token': '2' }
#     >>> res = login(params)
#     >>> print res
#     """
#     # 获取各个参数
#     login_name = kwargs.get('netid', None)
#     login_pwd = kwargs.get('pwd', None)
#     phone_num = kwargs.get('phone_num', None)
#     token = kwargs.get('token', None) 
#     res = {}
#     # 验证输入完整性
#     if not check_input(login_name, login_pwd, phone_num, res):
#         return  res
#     else:
#         conn = mysql_conn
#         # 首次登陆验证,利用netid验证
#         if not token:
#             token = verify_netid(login_name, login_pwd, res)
#             if not token: 
#                 return res 
#             else:
#                 # 保存token（根据netid pwd判断如果为新用户，则插入，否则则更新）
#                 save_user(conn, login_name, login_pwd, phone_num, token)
#         #　利用学号和token验证
#         else:
#             if not check_token(conn, token, login_name, res): 
#                 return res 
#         # 验证成功后验证答题次数
#         if not check_times_out(conn, token, res):
#             return res
#         # 用户答题答题次数加一
#         add_onetime(conn, token)
#         # 初始化验证成功的用户
#         user = UserCache()
#         user.init_user(token)
#         # 随机获取一道选择题
#         filters = user.get_question_list(token)
#         q = fetch_one(conn, QType.SELECT ,filters)
#         # 题id加到内存缓存列表中
#         user.add_question(token, q['question']['q_id'])
#         # 设置data部分
#         res['token'] = token
#         res['data'] = q
#         # 设置成功状态码
#         set_msg(res)
#         return res
# 
# def isRight(kwargs):
#     """
#     答案问题接口
#     request: token, type, q_id, o_id
#     response: {
#         status （状态码）
#         info  (错误信息)
#         is_right(上一道题是否正确)
#         data（下一道题的信息）
#     >>> # 正确答案例子
#     >>> token ='dda845241b3b11e5830274e543434a0f'
#     >>> params = {'token': token, 'type': 1, 'q_id': 1, 'o_id': 3}
#     >>> res = isRight(params)
#     >>> print res
#     >>> # 错误答案
#     >>> params = {'token': token, 'type': 1, 'q_id': 1, 'o_id': 1}
#     >>> res = isRight(params)
#     >>> print res
#     """
#     # 解析参数
#     token = kwargs.get('token', None) 
#     conn = mysql_conn
#     type = kwargs.get('type', None)
#     q_id = kwargs.get('q_id', None)
#     o_id = kwargs.get('o_id', None)
#     res = {}
#     user = UserCache()
# 
#     # 验证token
#     if not check_token(conn, token, None, res):
#         return res
#     # 验证是否超时
#     elif user.check_timeout(token):
#         res['status'] = StatusCode.TIMEOUT
#         set_msg(res)
#         return res
#     else:
#         # 验证答案
#         if is_right(conn, q_id, o_id):
#             res['is_right'] = 1
#             # 更新分数
#             sql = 'select `type` from question where  q_id=%s'
#             q_type = conn.get(sql, q_id).get('type')
#             user.update_score(token, q_type)  
#         else:
#             res['is_right'] = 0
#         # 获取下一道题
#         filters = user.get_question_list(token)
#         q = fetch_one(conn, type, filters)
#         if not q: return res
#         #添加题目到response
#         res['data'] = q
#         # 题id加到内存缓存列表中
#         user.add_question(token, q['question']['q_id'])
#         # 设置成功状态码
#         set_msg(res)
#         return res
#             
def getFanalSocre(kwargs):
    """
    获取最终得分接口
    >>> token ='dda845241b3b11e5830274e543434a0f'
    >>> params = {'token': token}
    >>> print getFanalSocre(params)
    """
    token = kwargs.get('token', None)
    conn = connect_to_db() 
    res = {}
    user = UserCache()
    # 验证token
    if not check_token(conn, token, None, res):
        return res
    else:
        score = user.get_user_socre(token)
        user.clear_user(token)
        best_score = update_user_score_in_mysql(conn, token, score)
        res['score'] = score if score else 0
        res['best_score'] = best_score
        set_msg(res)
        return res


if __name__ == '__main__':
    import doctest
    doctest.testmod()

