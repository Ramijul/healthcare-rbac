--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.0

-- Started on 2025-05-03 22:30:31 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

-- CREATE SCHEMA public;


-- ALTER SCHEMA public OWNER TO pg_database_owner;

-- --
-- -- TOC entry 3375 (class 0 OID 0)
-- -- Dependencies: 4
-- -- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
-- --

-- COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16397)
-- Name: patient_record; Type: TABLE; Schema: public; Owner: turbovets
--

CREATE TABLE public.patient_record (
    id integer NOT NULL,
    medical_data jsonb NOT NULL,
    organization_id character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    created_by integer,
    updated_by integer
);


ALTER TABLE public.patient_record OWNER TO turbovets;

--
-- TOC entry 219 (class 1259 OID 16396)
-- Name: patient_record_id_seq; Type: SEQUENCE; Schema: public; Owner: turbovets
--

CREATE SEQUENCE public.patient_record_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patient_record_id_seq OWNER TO turbovets;

--
-- TOC entry 3376 (class 0 OID 0)
-- Dependencies: 219
-- Name: patient_record_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: turbovets
--

ALTER SEQUENCE public.patient_record_id_seq OWNED BY public.patient_record.id;


--
-- TOC entry 218 (class 1259 OID 16386)
-- Name: user; Type: TABLE; Schema: public; Owner: turbovets
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying NOT NULL,
    name character varying NOT NULL,
    password character varying NOT NULL,
    role character varying NOT NULL,
    organization_id character varying NOT NULL
);


ALTER TABLE public."user" OWNER TO turbovets;

--
-- TOC entry 217 (class 1259 OID 16385)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: turbovets
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO turbovets;

--
-- TOC entry 3377 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: turbovets
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 3216 (class 2604 OID 16400)
-- Name: patient_record id; Type: DEFAULT; Schema: public; Owner: turbovets
--

ALTER TABLE ONLY public.patient_record ALTER COLUMN id SET DEFAULT nextval('public.patient_record_id_seq'::regclass);


--
-- TOC entry 3215 (class 2604 OID 16389)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: turbovets
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3222 (class 2606 OID 16404)
-- Name: patient_record PK_1f69f849b8f560b43999d1f0cbd; Type: CONSTRAINT; Schema: public; Owner: turbovets
--

ALTER TABLE ONLY public.patient_record
    ADD CONSTRAINT "PK_1f69f849b8f560b43999d1f0cbd" PRIMARY KEY (id);


--
-- TOC entry 3218 (class 2606 OID 16393)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: turbovets
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 3220 (class 2606 OID 16395)
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: turbovets
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- TOC entry 3223 (class 2606 OID 16410)
-- Name: patient_record FK_9cf88ac16464abd510208a638d5; Type: FK CONSTRAINT; Schema: public; Owner: turbovets
--

ALTER TABLE ONLY public.patient_record
    ADD CONSTRAINT "FK_9cf88ac16464abd510208a638d5" FOREIGN KEY (updated_by) REFERENCES public."user"(id);


--
-- TOC entry 3224 (class 2606 OID 16405)
-- Name: patient_record FK_a1dca96ddbc33bfc2793b4f587f; Type: FK CONSTRAINT; Schema: public; Owner: turbovets
--

ALTER TABLE ONLY public.patient_record
    ADD CONSTRAINT "FK_a1dca96ddbc33bfc2793b4f587f" FOREIGN KEY (created_by) REFERENCES public."user"(id);


INSERT INTO public."user" (id, username, name, password, role, organization_id) VALUES
(1, 'parentorg1_owner', 'Owner Parentorg1', '$2a$12$Ph0jykhpeNtx6L9dgAZDbuYUd7ZS1PZRvDtyuHMgAndx.ZDrpkIdS', 'owner', 'parentorg1'),
(2, 'suborg1_viewer', 'Viewer Suborg1', '$2a$12$Ph0jykhpeNtx6L9dgAZDbuYUd7ZS1PZRvDtyuHMgAndx.ZDrpkIdS', 'viewer', 'suborg1'),
(3, 'suborg1_admin', 'Admin Suborg1', '$2a$12$Ph0jykhpeNtx6L9dgAZDbuYUd7ZS1PZRvDtyuHMgAndx.ZDrpkIdS', 'admin', 'suborg1'),
(4, 'suborg1_owner', 'Owner Suborg1', '$2a$12$Ph0jykhpeNtx6L9dgAZDbuYUd7ZS1PZRvDtyuHMgAndx.ZDrpkIdS', 'owner', 'suborg1'),
(5, 'suborg2_admin', 'Admin Suborg2', '$2a$12$Ph0jykhpeNtx6L9dgAZDbuYUd7ZS1PZRvDtyuHMgAndx.ZDrpkIdS', 'admin', 'suborg2'),
(6, 'suborg2_viewer', 'Viewer Suborg2', '$2a$12$Ph0jykhpeNtx6L9dgAZDbuYUd7ZS1PZRvDtyuHMgAndx.ZDrpkIdS', 'viewer', 'suborg2'),
(7, 'suborg2_owner', 'Owner Suborg2', '$2a$12$Ph0jykhpeNtx6L9dgAZDbuYUd7ZS1PZRvDtyuHMgAndx.ZDrpkIdS', 'owner', 'suborg2'),
(8, 'parentorg2_owner', 'Owner Parentorg2', '$2a$12$Ph0jykhpeNtx6L9dgAZDbuYUd7ZS1PZRvDtyuHMgAndx.ZDrpkIdS', 'owner', 'parentorg2'),
(9, 'suborg3_viewer', 'Viewer Suborg3', '$2a$12$Ph0jykhpeNtx6L9dgAZDbuYUd7ZS1PZRvDtyuHMgAndx.ZDrpkIdS', 'viewer', 'suborg3');

-- Parentorg1 records
INSERT INTO public.patient_record (id, medical_data, organization_id, created_at, updated_at, created_by, updated_by) VALUES
(1, '{}'::jsonb, 'parentorg1', NOW(), NOW(), 1, 1),
(2, '{}'::jsonb, 'parentorg1', NOW(), NOW(), 1, 1),
(3, '{}'::jsonb, 'parentorg1', NOW(), NOW(), 1, 1),
(4, '{}'::jsonb, 'parentorg1', NOW(), NOW(), 1, 1),
(5, '{}'::jsonb, 'parentorg1', NOW(), NOW(), 1, 1),

-- Suborg1 records
(6, '{}'::jsonb, 'suborg1', NOW(), NOW(), 4, 4),
(7, '{}'::jsonb, 'suborg1', NOW(), NOW(), 4, 4),
(8, '{}'::jsonb, 'suborg1', NOW(), NOW(), 4, 4),
(9, '{}'::jsonb, 'suborg1', NOW(), NOW(), 4, 4),
(10, '{}'::jsonb, 'suborg1', NOW(), NOW(), 4, 4),

-- Suborg2 records
(11, '{}'::jsonb, 'suborg2', NOW(), NOW(), 7, 7),
(12, '{}'::jsonb, 'suborg2', NOW(), NOW(), 7, 7),
(13, '{}'::jsonb, 'suborg2', NOW(), NOW(), 7, 7),
(14, '{}'::jsonb, 'suborg2', NOW(), NOW(), 7, 7),
(15, '{}'::jsonb, 'suborg2', NOW(), NOW(), 7, 7),

-- Parentorg2 records
(16, '{}'::jsonb, 'parentorg2', NOW(), NOW(), 8, 8),
(17, '{}'::jsonb, 'parentorg2', NOW(), NOW(), 8, 8),
(18, '{}'::jsonb, 'parentorg2', NOW(), NOW(), 8, 8),
(19, '{}'::jsonb, 'parentorg2', NOW(), NOW(), 8, 8),
(20, '{}'::jsonb, 'parentorg2', NOW(), NOW(), 8, 8),

-- Suborg3 records
(21, '{}'::jsonb, 'suborg3', NOW(), NOW(), 8, 8),
(22, '{}'::jsonb, 'suborg3', NOW(), NOW(), 8, 8),
(23, '{}'::jsonb, 'suborg3', NOW(), NOW(), 8, 8),
(24, '{}'::jsonb, 'suborg3', NOW(), NOW(), 8, 8),
(25, '{}'::jsonb, 'suborg3', NOW(), NOW(), 8, 8),

-- Suborg4 records
(26, '{}'::jsonb, 'suborg4', NOW(), NOW(), 8, 8),
(27, '{}'::jsonb, 'suborg4', NOW(), NOW(), 8, 8),
(28, '{}'::jsonb, 'suborg4', NOW(), NOW(), 8, 8),
(29, '{}'::jsonb, 'suborg4', NOW(), NOW(), 8, 8),
(30, '{}'::jsonb, 'suborg4', NOW(), NOW(), 8, 8);


SELECT pg_catalog.setval('public.user_id_seq', 9, true);
SELECT pg_catalog.setval('public.patient_record_id_seq', 30, true);