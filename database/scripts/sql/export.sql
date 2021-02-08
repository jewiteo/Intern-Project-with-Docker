#--------------------------------------------------------
#--  File created - Thursday-November-05-2020   
#--------------------------------------------------------
#--------------------------------------------------------
#--  DDL for Table ACRONYM
#--------------------------------------------------------



  CREATE TABLE ACRONYM 
  (	"ID" NUMBER GENERATED ALWAYS AS IDENTITY MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE , 
	"ACRONYM" VARCHAR2(20 BYTE), 
	"FULL_TERM" VARCHAR2(100 BYTE), 
	"REMARK" VARCHAR2(250 BYTE), 
	"LANGUAGE" VARCHAR2(40 BYTE),
	"CREATOR" VARCHAR2(40 BYTE)
  ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
  NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "USERS" ;
  REM INSERTING into ACRONYM
  SET DEFINE OFF;

Insert into ACRONYM (ACRONYM,FULL_TERM,REMARK,LANGUAGE,CREATOR) values ('ttyl','talk to you later',null,'ENGLISH','admin');
Insert into ACRONYM (ACRONYM,FULL_TERM,REMARK,LANGUAGE,CREATOR) values ('idc','I don''t care',null,'ENGLISH','admin');
Insert into ACRONYM (ACRONYM,FULL_TERM,REMARK,LANGUAGE,CREATOR) values ('lol','laughing out loud',null,'ENGLISH','admin');
Insert into ACRONYM (ACRONYM,FULL_TERM,REMARK,LANGUAGE,CREATOR) values ('lmao','laughing my ass off',null,'ENGLISH','admin');
Insert into ACRONYM (ACRONYM,FULL_TERM,REMARK,LANGUAGE,CREATOR) values ('btw','by the way',null,'ENGLISH','admin');

#--------------------------------------------------------
#--  Constraints for Table ACRONYM
#--------------------------------------------------------

