#!/usr/bin/env python
# coding=utf-8

import urllib2
import cookielib
import time
import StringIO
import gzip

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

cj = cookielib.CookieJar()
opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
urllib2.install_opener(opener)

url = 'https://sso.sysu.edu.cn/cas/login?locale=zh_CN'
res = urllib2.urlopen(url)

from lxml import etree
tree = etree.HTML(res.read())
lt_value = tree.xpath('//input[@name="lt"]')[0].values()[-1]
execution_value = tree.xpath('//input[@name="execution"]')[0].values()[-1]

req = urllib2.Request(url)
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
    'username': 'houyf3',
    'password': '7briB?ce',
    'lt': lt_value,
    'execution': execution_value,
    '_eventId': 'submit',
    'code': '',
    'submit': '登录', 
}

import urllib
postData = urllib.urlencode(postData)
req.add_data(postData)
print postData
res = urllib2.urlopen(req)
# 该网站信息是压缩的,所以需要解压,并不是编码问题
data = res.read()
data = StringIO.StringIO(data)
gzipper = gzip.GzipFile(fileobj=data)
html = gzipper.read()
print html
