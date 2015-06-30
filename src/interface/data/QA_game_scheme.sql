drop database `QA_game`;
create database `QA_game`;
use QA_game;

-- 用户表
create table if not exists `user`(
    `u_id` int not null auto_increment,
    `login_name` varchar(10) not null comment '登陆用户名',
    `phone_num`  varchar(11) not null comment '用户手机号',
    `times` tinyint(2)  not null comment '用户答题次数',
    `best_score` int  not null comment '个人最高分数',
    `s_id`  tinyint(2) not null comment '所属校区',
    `token` varchar(256) comment '存放教务系统的验证token，第一次通过教务系统验证netid后,以后根据学号和根据该token来确定身份的合法性',
    primary key (`u_id`),
    index(`login_name`), 
    index(`phone_num`),
    index(`token`)
)engine = innodb default charset=utf8;

-- 问题表
create table if not exists `question`(
    q_id int not null auto_increment,
    note text null comment '问题描述',
    `type`  tinyint(2) not null comment '问题类型, 1 选择题, 2 表示判断题, 3表示拼图题, 4表示记忆题',
    s_id tinyint(2) null comment '所属校区',
    `meterial` text null comment '专门针对材料题',
    primary key (`q_id`)
)engine = innodb default charset=utf8;

-- 问题选项表
create table if not exists `options`(
    o_id int not null auto_increment,
    note varchar(100) not null comment '选项描述, 如果拼图题，则是图片碎片的url',
    q_id int not null comment '所属的题目',
    is_ans tinyint(2) null comment '如果是非拼图题,0 表示错误答案, 1表示正确答案', 
    primary key (`o_id`),
    constraint `fk_quora` foreign key(`q_id`) references question(`q_id`) on update cascade on delete cascade,
    index(`q_id`)
)engine = innodb default charset=utf8;

