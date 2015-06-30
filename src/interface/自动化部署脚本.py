#!/usr/bin/env python
# coding=utf-8
import pexpect
import os
from time import sleep

src_dir = '/home/houyf/Projects/QA_game/src/interface' 
os.chdir(src_dir)
print '数据库更新'
pexpect.run('ipython doc/选择题.py')
pexpect.run('ipython doc/判断.py')
pexpect.run('ipython doc/材料题.py')
src_dir = '/home/houyf/Projects/QA_game/src/interface/doc' 
os.chdir(src_dir)
pexpect.run('ipython doc/拼图.py')
src_dir = '/home/houyf/Projects/QA_game/src/interface/data' 
os.chdir(src_dir)
print '导出数据库...'
child = pexpect.run('sh mysqldump.sh')
print '成功导出数据库'
src_dir = '/home/houyf/Projects/QA_game/src/' 
os.chdir(src_dir)
print '打包interface...'
pexpect.run('tar zcvf interface.tar.gz interface')
sleep(2)
print '打包完毕'
print 'interface.tar.gz 传到远程主机...'
pexpect.run('scp interface.tar.gz root@115.29.178.150:/tmp/')
print '上传完毕'
print '登陆远程主机'
child = pexpect.spawn('ssh root@115.29.178.150')
sleep(4)
child.sendline('cd /tmp')
print '解压...'
child.sendline('tar zvxf interface.tar.gz')
sleep(3)
print '解压完毕'
child.sendline('rm -rf interface.tar.gz')
sleep(2)
print '覆盖'
child.sendline('rm -rf /var/www/html/interface')
sleep(2)
child.sendline('mv /tmp/interface /var/www/html/interface')
sleep(10)
print '更新远程数据库'
url = '/var/www/html/interface/data'
child.sendline('cd %s'%url)
sleep(1)
child.sendline('sh mysql_data.sh')
sleep(2)
print '重启下supervisor'
child.sendline('supervisorctl reload')
child.close()





