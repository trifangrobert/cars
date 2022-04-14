--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-04-14 13:31:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 841 (class 1247 OID 41307)
-- Name: categ_modele; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categ_modele AS ENUM (
    'lamborghini',
    'mclaren',
    'bmw',
    'ferrari',
    'bugatti'
);


ALTER TYPE public.categ_modele OWNER TO postgres;

--
-- TOC entry 832 (class 1247 OID 40971)
-- Name: roluri; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roluri AS ENUM (
    'admin',
    'moderator',
    'comun'
);


ALTER TYPE public.roluri OWNER TO postgres;

--
-- TOC entry 844 (class 1247 OID 41318)
-- Name: tipuri_produse; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipuri_produse AS ENUM (
    'urus',
    'aventador',
    'huracan',
    'sian',
    'm8',
    'coupe',
    'x6',
    'i8',
    'chiron',
    'veyron',
    'divo',
    'senna',
    'm4',
    'tributo',
    '720s'
);


ALTER TYPE public.tipuri_produse OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 16396)
-- Name: Tabel-Test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tabel-Test" (
    id integer NOT NULL,
    nume character varying(100) NOT NULL,
    pret integer DEFAULT 100 NOT NULL
);


ALTER TABLE public."Tabel-Test" OWNER TO postgres;

--
-- TOC entry 3367 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE "Tabel-Test"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Tabel-Test" IS 'Facem tabelu tabelos';


--
-- TOC entry 209 (class 1259 OID 16395)
-- Name: Tabel-Test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Tabel-Test" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Tabel-Test_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 214 (class 1259 OID 40992)
-- Name: accesari; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accesari (
    id integer NOT NULL,
    ip character varying(100) NOT NULL,
    user_id integer,
    pagina character varying(500) NOT NULL,
    data_accesare timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.accesari OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 40991)
-- Name: accesari_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accesari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accesari_id_seq OWNER TO postgres;

--
-- TOC entry 3371 (class 0 OID 0)
-- Dependencies: 213
-- Name: accesari_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accesari_id_seq OWNED BY public.accesari.id;


--
-- TOC entry 216 (class 1259 OID 41350)
-- Name: cars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cars (
    id integer NOT NULL,
    nume character varying(50) NOT NULL,
    descriere text,
    pret numeric(8,2) NOT NULL,
    horsepower integer NOT NULL,
    tip_produs public.tipuri_produse DEFAULT 'urus'::public.tipuri_produse,
    maxspeed integer NOT NULL,
    categorie public.categ_modele DEFAULT 'lamborghini'::public.categ_modele,
    tunings character varying[],
    steering_wheel_right boolean DEFAULT false NOT NULL,
    imagine character varying(300),
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    culoare character varying(50),
    CONSTRAINT cars_horsepower_check CHECK ((horsepower >= 0)),
    CONSTRAINT cars_maxspeed_check CHECK ((maxspeed >= 0))
);


ALTER TABLE public.cars OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 41349)
-- Name: cars_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cars_id_seq OWNER TO postgres;

--
-- TOC entry 3374 (class 0 OID 0)
-- Dependencies: 215
-- Name: cars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cars_id_seq OWNED BY public.cars.id;


--
-- TOC entry 212 (class 1259 OID 40978)
-- Name: utilizatori; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilizatori (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    nume character varying(100) NOT NULL,
    prenume character varying(100) NOT NULL,
    parola character varying(500) NOT NULL,
    rol public.roluri DEFAULT 'comun'::public.roluri NOT NULL,
    email character varying(100) NOT NULL,
    culoare_chat character varying(50) NOT NULL,
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cod character varying(200),
    confirmat_mail boolean DEFAULT false
);


ALTER TABLE public.utilizatori OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 40977)
-- Name: utilizatori_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilizatori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilizatori_id_seq OWNER TO postgres;

--
-- TOC entry 3377 (class 0 OID 0)
-- Dependencies: 211
-- Name: utilizatori_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilizatori_id_seq OWNED BY public.utilizatori.id;


--
-- TOC entry 3193 (class 2604 OID 40995)
-- Name: accesari id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari ALTER COLUMN id SET DEFAULT nextval('public.accesari_id_seq'::regclass);


--
-- TOC entry 3195 (class 2604 OID 41353)
-- Name: cars id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars ALTER COLUMN id SET DEFAULT nextval('public.cars_id_seq'::regclass);


--
-- TOC entry 3189 (class 2604 OID 40981)
-- Name: utilizatori id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori ALTER COLUMN id SET DEFAULT nextval('public.utilizatori_id_seq'::regclass);


--
-- TOC entry 3355 (class 0 OID 16396)
-- Dependencies: 210
-- Data for Name: Tabel-Test; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Tabel-Test" (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (1, 'abcd', 200);
INSERT INTO public."Tabel-Test" (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (2, 'mouse', 100);
INSERT INTO public."Tabel-Test" (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (3, 'zzzzzzz', 50);


--
-- TOC entry 3359 (class 0 OID 40992)
-- Dependencies: 214
-- Data for Name: accesari; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3361 (class 0 OID 41350)
-- Dependencies: 216
-- Data for Name: cars; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (1, 'Lamborghini Urus', 'Cea mai frumoasa masina', 300000.00, 650, 'urus', 305, 'lamborghini', '{"scaune incalzite",tablete}', false, 'urus.jpg', '2022-04-12 01:06:05.437741', 'black');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (2, 'Bmw M8', 'Un bmw interesant', 150000.00, 617, 'm8', 311, 'bmw', '{"sistem audio","aer conditionat"}', true, 'm8.jpg', '2022-04-12 01:06:05.437741', 'black');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (3, 'Mclaren Coupe', 'Mcdonalds', 170000.00, 562, 'coupe', 328, 'mclaren', '{"aer conditionat",spoiler}', true, 'coupe.jpg', '2022-04-12 01:06:05.437741', 'orange');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (4, 'Bmw I8', 'Un bmw misto', 200000.00, 570, 'i8', 300, 'bmw', '{"sistem audio",spoiler}', true, 'i8.jpg', '2022-04-12 01:06:05.437741', 'black');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (5, 'Lamborghini Aventador', 'O masina rapida', 300000.00, 660, 'aventador', 320, 'lamborghini', '{spoiler,tablete}', true, 'aventador.jpg', '2022-04-12 01:06:05.437741', 'white');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (6, 'Lamborghini Huracan', 'aventador wannabe', 250000.00, 570, 'huracan', 300, 'lamborghini', '{"scaune incalzite",tablete}', true, 'huracan.jpg', '2022-04-12 01:06:05.437741', 'sky-blue');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (7, 'Lamborghini Avendator Red', 'Vroom Vroom rosu', 320000.00, 640, 'aventador', 330, 'lamborghini', '{"aer conditionat",tablete}', false, 'red-avendator.jpg', '2022-04-12 01:06:05.437741', 'red');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (8, 'Lamborghini Sian', 'Old but gold', 700000.00, 807, 'sian', 350, 'lamborghini', '{turbo,spoiler}', false, 'sian.jpg', '2022-04-12 01:06:05.437741', 'turquoise');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (9, 'Mclaren 720s', 'Nava spatiala', 315000.00, 710, '720s', 341, 'mclaren', '{spoiler,turbo}', false, 'orange-mclaren.jpg', '2022-04-12 01:06:05.437741', 'orange');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (10, 'Bugatti Chiron', 'Cea mai rapida', 970000.00, 1500, 'chiron', 381, 'bugatti', '{lux,turbo}', false, 'chiron.jpg', '2022-04-12 01:06:05.437741', 'white');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (11, 'Bugatti Divo', 'Arata genial', 900000.00, 1479, 'divo', 380, 'bugatti', '{"sistem audio",gps}', true, 'divo.jpg', '2022-04-12 01:06:05.437741', 'black');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (12, 'Bmw M4 Competition', 'Masina de drifturi', 194000.00, 473, 'm4', 303, 'bmw', '{"drift tires",tablete}', false, 'm4-comp.jpg', '2022-04-12 01:06:05.437741', 'yellow');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (13, 'Bmw M8 Blue', 'Bmw-ul oceanelor', 132000.00, 620, 'm8', 311, 'bmw', '{spoiler,"sistem audo"}', false, 'm8-blue.jpg', '2022-04-12 01:06:05.437741', 'blue');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (14, 'Mclaren Senna', 'ozn de la mclaren', 900000.00, 789, 'senna', 340, 'mclaren', '{"scaune incalzite","aer conditionat"}', true, 'senna.jpg', '2022-04-12 01:06:05.437741', 'red');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (15, 'Ferrari Tributo', 'Ferrari aduce tribut haha', 290000.00, 640, 'tributo', 320, 'ferrari', '{lux,drift}', false, 'tributo.jpg', '2022-04-12 01:06:05.437741', 'red');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (16, 'Lamborghini Urus Blue', 'Cea mai frumoasa masina pe albastru', 310000.00, 660, 'urus', 320, 'lamborghini', '{"scaune incalizate",turbo}', false, 'urus-blue.jpg', '2022-04-12 01:06:05.437741', 'blue');
INSERT INTO public.cars (id, nume, descriere, pret, horsepower, tip_produs, maxspeed, categorie, tunings, steering_wheel_right, imagine, data_adaugare, culoare) VALUES (17, 'Bugatti Veyron', 'Am fost recent prin Bucuresti', 800000.00, 987, 'veyron', 431, 'bugatti', '{spoiler,lux}', true, 'veyron.jpg', '2022-04-12 01:06:05.437741', 'black-orange');


--
-- TOC entry 3357 (class 0 OID 40978)
-- Dependencies: 212
-- Data for Name: utilizatori; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3379 (class 0 OID 0)
-- Dependencies: 209
-- Name: Tabel-Test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Tabel-Test_id_seq"', 3, true);


--
-- TOC entry 3380 (class 0 OID 0)
-- Dependencies: 213
-- Name: accesari_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accesari_id_seq', 1, false);


--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 215
-- Name: cars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cars_id_seq', 17, true);


--
-- TOC entry 3382 (class 0 OID 0)
-- Dependencies: 211
-- Name: utilizatori_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilizatori_id_seq', 1, false);


--
-- TOC entry 3203 (class 2606 OID 16401)
-- Name: Tabel-Test Tabel-Test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tabel-Test"
    ADD CONSTRAINT "Tabel-Test_pkey" PRIMARY KEY (id);


--
-- TOC entry 3209 (class 2606 OID 41000)
-- Name: accesari accesari_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_pkey PRIMARY KEY (id);


--
-- TOC entry 3211 (class 2606 OID 41365)
-- Name: cars cars_nume_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_nume_key UNIQUE (nume);


--
-- TOC entry 3213 (class 2606 OID 41363)
-- Name: cars cars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_pkey PRIMARY KEY (id);


--
-- TOC entry 3205 (class 2606 OID 40988)
-- Name: utilizatori utilizatori_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_pkey PRIMARY KEY (id);


--
-- TOC entry 3207 (class 2606 OID 40990)
-- Name: utilizatori utilizatori_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_username_key UNIQUE (username);


--
-- TOC entry 3214 (class 2606 OID 41001)
-- Name: accesari accesari_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.utilizatori(id);


--
-- TOC entry 3368 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE "Tabel-Test"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public."Tabel-Test" TO king;


--
-- TOC entry 3369 (class 0 OID 0)
-- Dependencies: 209
-- Name: SEQUENCE "Tabel-Test_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public."Tabel-Test_id_seq" TO king;


--
-- TOC entry 3370 (class 0 OID 0)
-- Dependencies: 214
-- Name: TABLE accesari; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.accesari TO king;


--
-- TOC entry 3372 (class 0 OID 0)
-- Dependencies: 213
-- Name: SEQUENCE accesari_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.accesari_id_seq TO king;


--
-- TOC entry 3373 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE cars; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cars TO king;


--
-- TOC entry 3375 (class 0 OID 0)
-- Dependencies: 215
-- Name: SEQUENCE cars_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cars_id_seq TO king;


--
-- TOC entry 3376 (class 0 OID 0)
-- Dependencies: 212
-- Name: TABLE utilizatori; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.utilizatori TO king;


--
-- TOC entry 3378 (class 0 OID 0)
-- Dependencies: 211
-- Name: SEQUENCE utilizatori_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.utilizatori_id_seq TO king;


-- Completed on 2022-04-14 13:31:57

--
-- PostgreSQL database dump complete
--

