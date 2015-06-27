#!/usr/bin/env python
# coding=utf-8

import time
from config.database import *
from config.base import *
from config.enum import *
from config.ans import *

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

class MemoryCache(object):

    def __init__(self):
        self._conn = self._connect()
        self.delete = self._conn.delete

    def _connect(self):
        """
        建立连接
        """
        pass
    def get(sef, key):
        """
        获取list, dict, number, str
        """
        pass
    def set(self, key, value):
        """
        设置list, dict, number, str
        """
        pass
    def append(self, key, value):
        """
        往key对应的list或者str添加后缀元素
        """
        pass
    def remove(self, key, value):
        """ 
        往key对应的list中删除特定元素
        """
        pass
    def incr(self, key, delta):
        """
        对于number元素进行增减(兼容浮点)
        """
        pass

class Memcache(MemoryCache):
    """
    >>> obj = Memcache()
    >>> obj.get('1')
    >>> obj.set('1', '1') #str
    >>> print obj.get('1')
    >>> obj.set('1', {'1': 2}) #dict
    >>> print obj.get('1')
    >>> obj.set('1', [1,2,3]) #list
    >>> print obj.get('1')
    >>> obj.append('1', 4) #append to list
    >>> print obj.get('1')
    >>> obj.remove('1', 2) #remove a element from the list
    >>> print obj.get('1')
    >>> obj.set('1', 1)
    >>> obj.incr('1', 100)
    >>> print obj.get('1')
    >>> obj.incr('1', -100)
    >>> print obj.get('1')
    >>> obj.incr('1', 1.232)
    >>> print obj.get('1')
    """
    def _connect(self):
        import memcache 
        return memcache.Client(['localhost'])
    
    def get(self, key):
        return self._conn.get(key)

    def set(self, key, value):
        times = 3
        while (not self._conn.set(key, value)) and times > 0:
            times -= 1
        return times > 0
    
    def incr(self, key, delta=1):
        if isinstance(delta, float):
            old = self._conn.get(key)
            return self._conn.set(key, old+delta) 
        elif delta >= 0:
            return self._conn.incr(key, delta)
        else:
            return self._conn.decr(key, -delta)

    def append(self, key, value):
        old = self._conn.get(key)
        if not old: old = []
        if isinstance(old, list) or isinstance(old, str):
            old.append(value)
            self._conn.set(key, old)
            return True
        else:
            return False 
    
    def remove(self, key, value):
        old = self.get(key)
        old.remove(value)
        self.set(key, old)
 
import redis
class Redis(MemoryCache):
    """
    >>> obj = Redis()
    >>> obj.set('1', '1') #str
    >>> print obj.get('1')
    >>> obj.set('1', {'1': 2}) #dict
    >>> print obj.get('1')
    >>> obj.set('1', [1,2,3]) #list
    >>> print obj.get('1')
    >>> obj.append('1', 4) #append to list
    >>> print obj.get('1')
    >>> obj.remove('1', 2) #remove a element from the list
    >>> print obj.get('1')
    >>> obj.set('1', 1)
    >>> obj.incr('1', 100)
    >>> print obj.get('1')
    >>> obj.incr('1', -100)
    >>> print obj.get('1')
    >>> obj.incr('1', 1.232)
    >>> print obj.get('1')
    """

    def _connect(self):
        return redis.Redis()
    
    def get(self, key):
        try:
            val = self._conn.get(key)
            if not val: return val
            # 如果是整数
            if val.isdigit():
                return int(val)
            # 如果是浮点数
            try:
                val = float(val)
                return val
            except:
                pass
            # 如果是列表,字典
            if val and (val.startswith('[') or val.startswith('{')):
                val = eval(val)
        except redis.ResponseError:
            val = list(self._conn.smembers(key))
        return val
 
    def set(self, key, value):
        self._conn.delete(key)
        if isinstance(value, list):
            for i in value:
               self._conn.sadd(key, i)
        else:
            self._conn.set(key, value)

    def incr(self, key, delta=1):
        if delta >= 0:
            if isinstance(delta, float):
                return self._conn.incrbyfloat(key, delta)
            else:
                return self._conn.incr(key, delta)
        else:
            return self._conn.decr(key, -delta)
    
    def append(self, key, value):
        try:
            if not self._conn.get(key):
                raise redis.ResponseError
            self._conn.append(key, value)
        except redis.ResponseError:
            self._conn.sadd(key, value)
             
    def remove(self, key, value):
        self._conn.srem(key, value)

class UserCache(Redis):
    """
    >>> token = 'test'
    >>> user = UserCache()
    >>> user.init_user(token)
    >>> user.check_timeout(token) 
    >>> user.printUser(token) 
    >>> user.add_question(token, 1)
    >>> user.add_question(token, (2, 1, 0))
    >>> user.printUser(token) 
    >>> user.check_timeout(token) 
    >>> user.update_score(token, 1)
    >>> user.update_score(token, 2)
    >>> user.update_score(token, 4)
    >>> user.printUser(token)
    """
    
    def init_user(self, token):
        """
        在内存缓存中初始化开始答题的用户数据结构
        """
        import time
        if self.get(token):
            self.clear_user(token)
        self.set(token, True)    
        self.set('%s:start_time'%token, time.time())
        self.set('%s:score'%token, 0)

    def clear_user(self, token):
        """
        清理用户的内存缓存
        """
        self.delete(token)
        self.delete('%s:start_time'%token)
        self.delete('%s:score'%token)
        self.delete('%s:q_list'%token)

    def printUser(self, token):
        """
        打印出基本用户信息
        """
        print '#######################'
        print 'name: %s'% self.get(token)
        print 'starttime: %s'% str(self.get('%s:start_time'%token))
        print  'total score: %s'% str(self.get('%s:score'%token))
        print 'question list:'
        q_list = self.get('%s:q_list'%token)
        if q_list: print q_list
        print '#######################'

    def add_question(self, token, question):
        """
        question: (q_id, o_id, status)
        """
        return self.append('%s:q_list'%token, question)
        
    def update_question_status(self, token, question, status): 
        """
        更新用户答题状态
        False => 错;
        True => 对
        """      
        pass

    def check_timeout(self, token):
        """
        验证用户答题时间限制
        """ 
        import time
        if time.time() - self._get_starttime(token) >= TIMEOUT :
            return False
        return True

    def _get_starttime(self, token):
        """"
        从内存缓存中根据用户token获取该用户的开始答题时间
        """
        return self.get('%s:start_time'%token)

    def get_question_list(self, token):
        """
        从内存缓存中获取已经答的题q_id列表
        """
        return self.get('%s:q_list'%token)

    def update_score(self, token, type):
        """
        更新用户临时分数
        """
        return self.incr('%s:score'%token, TypeScore[type])

    def get_user_socre(self, token):
        """
        从内存缓存中根据token获取用户的总得分
        """ 
        return self.get('%s:score'%token)    

    def check_dump(self, token, q_id):
        """
        防止重复刷同一道题
        """ 

if __name__ == '__main__':
    import doctest
    doctest.testmod()
