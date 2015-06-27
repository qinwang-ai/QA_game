#!/usr/bin/env python
# coding=utf-8

class QType(object):
    SELECT = 1
    PINTU = 2
    JUDGE = 3
    MEMORY = 4

TypeScore = {
    QType.SELECT: 3,
    QType.PINTU: 4,
    QType.JUDGE: 3,
    QType.MEMORY: 2,
}

class CampusArea(object):
    EAST = 1
    SOUTH = 2
    WEST = 3
    ZHUHAI = 4

class AnswerStatus(object):
    UNANSWER = 0
    WRONG = 1
    RIGHT = 2

Campus = {
    '珠海': CampusArea.ZHUHAI,
    '南校': CampusArea.SOUTH,
    '东校': CampusArea.EAST,
    '北校': CampusArea.WEST,
}


class StatusCode(object):
    INVALID_TOKEN = 1
    INVALID_USERNAME = 2
    INVALID_TYPE = 3
    INVALID_PHONE = 4
    TIMEOUT = 6
    TIMES_OUT = 7
    WRONG_ANSER = 8
    OK = 0
    
ErrorMsg = {
    StatusCode.INVALID_USERNAME: '错误用户名或者密码',
    StatusCode.INVALID_PHONE: '非法手机号', 
    StatusCode.INVALID_TOKEN: '无效token',
    StatusCode.INVALID_TYPE: '题目类型错误',
    StatusCode.TIMEOUT: '答题超时',
    StatusCode.OK: '请求合法',
    StatusCode.TIMES_OUT: '超过答题次数限制',
    StatusCode.WRONG_ANSER: '答案错误',
}
