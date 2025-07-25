--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: additives; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.additives (
    additive_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    concentration numeric(5,2)
);


ALTER TABLE public.additives OWNER TO postgres;

--
-- Name: additives_additive_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.additives_additive_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.additives_additive_id_seq OWNER TO postgres;

--
-- Name: additives_additive_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.additives_additive_id_seq OWNED BY public.additives.additive_id;


--
-- Name: allocations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.allocations (
    allocation_id integer NOT NULL,
    tanker_id character varying(50),
    tank_id character varying(50),
    quantity numeric(10,2),
    oil_type character varying(50),
    allocation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.allocations OWNER TO postgres;

--
-- Name: allocations_allocation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.allocations_allocation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.allocations_allocation_id_seq OWNER TO postgres;

--
-- Name: allocations_allocation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.allocations_allocation_id_seq OWNED BY public.allocations.allocation_id;


--
-- Name: analysis_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analysis_profiles (
    profile_id integer NOT NULL,
    name character varying(100) NOT NULL,
    oil_type character varying(50),
    properties jsonb
);


ALTER TABLE public.analysis_profiles OWNER TO postgres;

--
-- Name: analysis_profiles_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analysis_profiles_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analysis_profiles_profile_id_seq OWNER TO postgres;

--
-- Name: analysis_profiles_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analysis_profiles_profile_id_seq OWNED BY public.analysis_profiles.profile_id;


--
-- Name: bol_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bol_messages (
    bol_id integer NOT NULL,
    shipment_id integer,
    details jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bol_messages OWNER TO postgres;

--
-- Name: bol_messages_bol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bol_messages_bol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bol_messages_bol_id_seq OWNER TO postgres;

--
-- Name: bol_messages_bol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bol_messages_bol_id_seq OWNED BY public.bol_messages.bol_id;


--
-- Name: carriers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carriers (
    carrier_id integer NOT NULL,
    name character varying(100) NOT NULL,
    type character varying(50),
    contact_info jsonb
);


ALTER TABLE public.carriers OWNER TO postgres;

--
-- Name: carriers_carrier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carriers_carrier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carriers_carrier_id_seq OWNER TO postgres;

--
-- Name: carriers_carrier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carriers_carrier_id_seq OWNED BY public.carriers.carrier_id;


--
-- Name: crude_oil_leases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crude_oil_leases (
    lease_id integer NOT NULL,
    lease_name character varying(100) NOT NULL,
    location character varying(100),
    start_date date,
    end_date date
);


ALTER TABLE public.crude_oil_leases OWNER TO postgres;

--
-- Name: crude_oil_leases_lease_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.crude_oil_leases_lease_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.crude_oil_leases_lease_id_seq OWNER TO postgres;

--
-- Name: crude_oil_leases_lease_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.crude_oil_leases_lease_id_seq OWNED BY public.crude_oil_leases.lease_id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    customer_id integer NOT NULL,
    name character varying(100) NOT NULL,
    contact_info jsonb,
    delivery_address text
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_customer_id_seq OWNER TO postgres;

--
-- Name: customers_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;


--
-- Name: destinations_origins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.destinations_origins (
    location_id integer NOT NULL,
    name character varying(100) NOT NULL,
    type character varying(50),
    address text
);


ALTER TABLE public.destinations_origins OWNER TO postgres;

--
-- Name: destinations_origins_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.destinations_origins_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.destinations_origins_location_id_seq OWNER TO postgres;

--
-- Name: destinations_origins_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.destinations_origins_location_id_seq OWNED BY public.destinations_origins.location_id;


--
-- Name: dot_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dot_messages (
    dot_message_id integer NOT NULL,
    transport_id integer,
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.dot_messages OWNER TO postgres;

--
-- Name: dot_messages_dot_message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dot_messages_dot_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dot_messages_dot_message_id_seq OWNER TO postgres;

--
-- Name: dot_messages_dot_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dot_messages_dot_message_id_seq OWNED BY public.dot_messages.dot_message_id;


--
-- Name: drivers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers (
    driver_id integer NOT NULL,
    name character varying(100) NOT NULL,
    license_number character varying(50),
    carrier_id integer
);


ALTER TABLE public.drivers OWNER TO postgres;

--
-- Name: drivers_driver_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drivers_driver_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drivers_driver_id_seq OWNER TO postgres;

--
-- Name: drivers_driver_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drivers_driver_id_seq OWNED BY public.drivers.driver_id;


--
-- Name: exstars_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exstars_products (
    product_id integer NOT NULL,
    code character varying(50) NOT NULL,
    description text
);


ALTER TABLE public.exstars_products OWNER TO postgres;

--
-- Name: exstars_products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exstars_products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exstars_products_product_id_seq OWNER TO postgres;

--
-- Name: exstars_products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exstars_products_product_id_seq OWNED BY public.exstars_products.product_id;


--
-- Name: facility_ids; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facility_ids (
    facility_id integer NOT NULL,
    id_code character varying(50) NOT NULL,
    name character varying(100),
    address text
);


ALTER TABLE public.facility_ids OWNER TO postgres;

--
-- Name: facility_ids_facility_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.facility_ids_facility_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.facility_ids_facility_id_seq OWNER TO postgres;

--
-- Name: facility_ids_facility_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.facility_ids_facility_id_seq OWNED BY public.facility_ids.facility_id;


--
-- Name: footnote_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.footnote_messages (
    footnote_id integer NOT NULL,
    message text,
    exstars_product_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.footnote_messages OWNER TO postgres;

--
-- Name: footnote_messages_footnote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.footnote_messages_footnote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.footnote_messages_footnote_id_seq OWNER TO postgres;

--
-- Name: footnote_messages_footnote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.footnote_messages_footnote_id_seq OWNED BY public.footnote_messages.footnote_id;


--
-- Name: manual_inputs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manual_inputs (
    id integer NOT NULL,
    tank_id character varying,
    level numeric,
    temperature numeric,
    pressure numeric,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.manual_inputs OWNER TO postgres;

--
-- Name: manual_inputs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manual_inputs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.manual_inputs_id_seq OWNER TO postgres;

--
-- Name: manual_inputs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manual_inputs_id_seq OWNED BY public.manual_inputs.id;


--
-- Name: modbus_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modbus_settings (
    tank_id character varying(50) NOT NULL,
    ip_address character varying(15) NOT NULL,
    port integer NOT NULL,
    unit_id integer NOT NULL,
    level_register integer NOT NULL,
    temperature_register integer NOT NULL,
    pressure_register integer NOT NULL,
    status_register integer NOT NULL
);


ALTER TABLE public.modbus_settings OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying,
    type character varying,
    properties jsonb,
    density numeric
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: rail_cars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rail_cars (
    rail_car_id integer NOT NULL,
    car_number character varying(50) NOT NULL,
    capacity numeric(10,2),
    carrier_id integer
);


ALTER TABLE public.rail_cars OWNER TO postgres;

--
-- Name: rail_cars_rail_car_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rail_cars_rail_car_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rail_cars_rail_car_id_seq OWNER TO postgres;

--
-- Name: rail_cars_rail_car_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rail_cars_rail_car_id_seq OWNED BY public.rail_cars.rail_car_id;


--
-- Name: shippers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shippers (
    shipper_id integer NOT NULL,
    name character varying(100) NOT NULL,
    contact_info jsonb
);


ALTER TABLE public.shippers OWNER TO postgres;

--
-- Name: shippers_shipper_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shippers_shipper_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shippers_shipper_id_seq OWNER TO postgres;

--
-- Name: shippers_shipper_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shippers_shipper_id_seq OWNED BY public.shippers.shipper_id;


--
-- Name: strapping_tables; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.strapping_tables (
    id integer NOT NULL,
    tank_id character varying,
    level numeric,
    volume numeric
);


ALTER TABLE public.strapping_tables OWNER TO postgres;

--
-- Name: strapping_tables_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.strapping_tables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapping_tables_id_seq OWNER TO postgres;

--
-- Name: strapping_tables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.strapping_tables_id_seq OWNED BY public.strapping_tables.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    supplier_id integer NOT NULL,
    name character varying(100) NOT NULL,
    contact_info jsonb
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suppliers_supplier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_supplier_id_seq OWNER TO postgres;

--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_supplier_id_seq OWNED BY public.suppliers.supplier_id;


--
-- Name: tank_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tank_data (
    id integer NOT NULL,
    tank_id character varying(50),
    level double precision,
    temperature double precision,
    pressure double precision,
    "timestamp" timestamp with time zone,
    status integer DEFAULT 0
);


ALTER TABLE public.tank_data OWNER TO postgres;

--
-- Name: tank_data_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tank_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tank_data_id_seq OWNER TO postgres;

--
-- Name: tank_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tank_data_id_seq OWNED BY public.tank_data.id;


--
-- Name: tank_measurements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tank_measurements (
    id integer NOT NULL,
    tank_id character varying,
    level numeric,
    temperature numeric,
    pressure numeric,
    status integer,
    product_id integer,
    density numeric,
    oil_type character varying,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tank_measurements OWNER TO postgres;

--
-- Name: tank_measurements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tank_measurements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tank_measurements_id_seq OWNER TO postgres;

--
-- Name: tank_measurements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tank_measurements_id_seq OWNED BY public.tank_measurements.id;


--
-- Name: tank_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tank_products (
    tank_id character varying NOT NULL,
    product_id integer,
    quantity numeric,
    oil_type character varying
);


ALTER TABLE public.tank_products OWNER TO postgres;

--
-- Name: tracking_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tracking_codes (
    tracking_code_id integer NOT NULL,
    code character varying(50) NOT NULL,
    shipment_id integer
);


ALTER TABLE public.tracking_codes OWNER TO postgres;

--
-- Name: tracking_codes_tracking_code_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tracking_codes_tracking_code_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tracking_codes_tracking_code_id_seq OWNER TO postgres;

--
-- Name: tracking_codes_tracking_code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tracking_codes_tracking_code_id_seq OWNED BY public.tracking_codes.tracking_code_id;


--
-- Name: transports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transports (
    transport_id integer NOT NULL,
    vehicle_type character varying(50),
    vehicle_number character varying(50),
    carrier_id integer
);


ALTER TABLE public.transports OWNER TO postgres;

--
-- Name: transports_transport_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transports_transport_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transports_transport_id_seq OWNER TO postgres;

--
-- Name: transports_transport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transports_transport_id_seq OWNED BY public.transports.transport_id;


--
-- Name: additives additive_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.additives ALTER COLUMN additive_id SET DEFAULT nextval('public.additives_additive_id_seq'::regclass);


--
-- Name: allocations allocation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.allocations ALTER COLUMN allocation_id SET DEFAULT nextval('public.allocations_allocation_id_seq'::regclass);


--
-- Name: analysis_profiles profile_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analysis_profiles ALTER COLUMN profile_id SET DEFAULT nextval('public.analysis_profiles_profile_id_seq'::regclass);


--
-- Name: bol_messages bol_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bol_messages ALTER COLUMN bol_id SET DEFAULT nextval('public.bol_messages_bol_id_seq'::regclass);


--
-- Name: carriers carrier_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carriers ALTER COLUMN carrier_id SET DEFAULT nextval('public.carriers_carrier_id_seq'::regclass);


--
-- Name: crude_oil_leases lease_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crude_oil_leases ALTER COLUMN lease_id SET DEFAULT nextval('public.crude_oil_leases_lease_id_seq'::regclass);


--
-- Name: customers customer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);


--
-- Name: destinations_origins location_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinations_origins ALTER COLUMN location_id SET DEFAULT nextval('public.destinations_origins_location_id_seq'::regclass);


--
-- Name: dot_messages dot_message_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dot_messages ALTER COLUMN dot_message_id SET DEFAULT nextval('public.dot_messages_dot_message_id_seq'::regclass);


--
-- Name: drivers driver_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers ALTER COLUMN driver_id SET DEFAULT nextval('public.drivers_driver_id_seq'::regclass);


--
-- Name: exstars_products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exstars_products ALTER COLUMN product_id SET DEFAULT nextval('public.exstars_products_product_id_seq'::regclass);


--
-- Name: facility_ids facility_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_ids ALTER COLUMN facility_id SET DEFAULT nextval('public.facility_ids_facility_id_seq'::regclass);


--
-- Name: footnote_messages footnote_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.footnote_messages ALTER COLUMN footnote_id SET DEFAULT nextval('public.footnote_messages_footnote_id_seq'::regclass);


--
-- Name: manual_inputs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manual_inputs ALTER COLUMN id SET DEFAULT nextval('public.manual_inputs_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: rail_cars rail_car_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rail_cars ALTER COLUMN rail_car_id SET DEFAULT nextval('public.rail_cars_rail_car_id_seq'::regclass);


--
-- Name: shippers shipper_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shippers ALTER COLUMN shipper_id SET DEFAULT nextval('public.shippers_shipper_id_seq'::regclass);


--
-- Name: strapping_tables id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.strapping_tables ALTER COLUMN id SET DEFAULT nextval('public.strapping_tables_id_seq'::regclass);


--
-- Name: suppliers supplier_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN supplier_id SET DEFAULT nextval('public.suppliers_supplier_id_seq'::regclass);


--
-- Name: tank_data id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tank_data ALTER COLUMN id SET DEFAULT nextval('public.tank_data_id_seq'::regclass);


--
-- Name: tank_measurements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tank_measurements ALTER COLUMN id SET DEFAULT nextval('public.tank_measurements_id_seq'::regclass);


--
-- Name: tracking_codes tracking_code_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_codes ALTER COLUMN tracking_code_id SET DEFAULT nextval('public.tracking_codes_tracking_code_id_seq'::regclass);


--
-- Name: transports transport_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transports ALTER COLUMN transport_id SET DEFAULT nextval('public.transports_transport_id_seq'::regclass);


--
-- Data for Name: additives; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.additives (additive_id, name, description, concentration) FROM stdin;
1	Additive A	Improves viscosity	0.50
\.


--
-- Data for Name: allocations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.allocations (allocation_id, tanker_id, tank_id, quantity, oil_type, allocation_date) FROM stdin;
1	TANKER-001	TANK-001	1000.00	Light Crude	2025-06-28 09:38:38.330951
\.


--
-- Data for Name: analysis_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analysis_profiles (profile_id, name, oil_type, properties) FROM stdin;
\.


--
-- Data for Name: bol_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bol_messages (bol_id, shipment_id, details, created_at) FROM stdin;
\.


--
-- Data for Name: carriers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carriers (carrier_id, name, type, contact_info) FROM stdin;
1	FastFreight	Truck	{"email": "contact@fastfreight.com", "phone": "555-1234"}
\.


--
-- Data for Name: crude_oil_leases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crude_oil_leases (lease_id, lease_name, location, start_date, end_date) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (customer_id, name, contact_info, delivery_address) FROM stdin;
1	Refinery A	{"phone": "555-5678"}	123 Refinery Rd
\.


--
-- Data for Name: destinations_origins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.destinations_origins (location_id, name, type, address) FROM stdin;
\.


--
-- Data for Name: dot_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dot_messages (dot_message_id, transport_id, message, created_at) FROM stdin;
\.


--
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drivers (driver_id, name, license_number, carrier_id) FROM stdin;
\.


--
-- Data for Name: exstars_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exstars_products (product_id, code, description) FROM stdin;
\.


--
-- Data for Name: facility_ids; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facility_ids (facility_id, id_code, name, address) FROM stdin;
\.


--
-- Data for Name: footnote_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.footnote_messages (footnote_id, message, exstars_product_id, created_at) FROM stdin;
\.


--
-- Data for Name: manual_inputs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manual_inputs (id, tank_id, level, temperature, pressure, "timestamp") FROM stdin;
\.


--
-- Data for Name: modbus_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modbus_settings (tank_id, ip_address, port, unit_id, level_register, temperature_register, pressure_register, status_register) FROM stdin;
TANK-002	192.168.1.100	502	2	0	1	2	3
TANK-003	192.168.1.100	502	3	0	1	2	3
TANK-001	192.168.1.100	502	1	0	1	2	3
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, type, properties, density) FROM stdin;
1	Product A	Crude Oil	{"api_gravity": 35}	850.0
2	Product B	Crude Oil	{"api_gravity": 30}	860.0
\.


--
-- Data for Name: rail_cars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rail_cars (rail_car_id, car_number, capacity, carrier_id) FROM stdin;
\.


--
-- Data for Name: shippers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shippers (shipper_id, name, contact_info) FROM stdin;
\.


--
-- Data for Name: strapping_tables; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.strapping_tables (id, tank_id, level, volume) FROM stdin;
1	TANK-001	0.0	0.0
2	TANK-001	1.0	100.0
3	TANK-001	2.0	200.0
4	TANK-001	5.0	500.0
5	TANK-002	0.0	0.0
6	TANK-002	1.0	90.0
7	TANK-002	2.0	180.0
8	TANK-002	4.5	405.0
9	TANK-003	0.0	0.0
10	TANK-003	1.0	110.0
11	TANK-003	2.0	220.0
12	TANK-003	6.0	660.0
13	TANK-001	0.0	0.0
14	TANK-001	1.0	100.0
15	TANK-001	2.0	200.0
16	TANK-001	5.0	500.0
17	TANK-002	0.0	0.0
18	TANK-002	1.0	90.0
19	TANK-002	2.0	180.0
20	TANK-002	4.5	405.0
21	TANK-003	0.0	0.0
22	TANK-003	1.0	110.0
23	TANK-003	2.0	220.0
24	TANK-003	6.0	660.0
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (supplier_id, name, contact_info) FROM stdin;
\.


--
-- Data for Name: tank_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tank_data (id, tank_id, level, temperature, pressure, "timestamp", status) FROM stdin;
1	TANK-001	50	5	25	2025-06-27 14:59:14.903-05	0
2	TANK-003	75	2	30.5	2025-06-27 14:59:14.917006-05	0
3	TANK-001	50.5	25	5	2025-06-27 07:00:00-05	1
4	TANK-002	75.2	30.5	6.2	2025-06-27 07:01:00-05	0
\.


--
-- Data for Name: tank_measurements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tank_measurements (id, tank_id, level, temperature, pressure, status, product_id, density, oil_type, "timestamp") FROM stdin;
1	TANK-001	5.0	25.0	6.0	0	1	850.0	Light Crude	2025-06-28 11:00:00
2	TANK-002	4.5	24.0	5.8	0	1	850.0	Light Crude	2025-06-28 11:00:00
3	TANK-003	6.0	26.0	6.2	1	2	860.0	Heavy Crude	2025-06-28 11:00:00
4	TANK-001	5.0	25.0	6.0	0	1	850.0	Light Crude	2025-06-28 11:00:00
5	TANK-002	4.5	24.0	5.8	0	1	850.0	Light Crude	2025-06-28 11:00:00
6	TANK-003	6.0	26.0	6.2	1	2	860.0	Heavy Crude	2025-06-28 11:00:00
\.


--
-- Data for Name: tank_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tank_products (tank_id, product_id, quantity, oil_type) FROM stdin;
TANK-001	1	1000.0	Light Crude
TANK-002	1	900.0	Light Crude
TANK-003	2	1100.0	Heavy Crude
\.


--
-- Data for Name: tracking_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tracking_codes (tracking_code_id, code, shipment_id) FROM stdin;
\.


--
-- Data for Name: transports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transports (transport_id, vehicle_type, vehicle_number, carrier_id) FROM stdin;
\.


--
-- Name: additives_additive_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.additives_additive_id_seq', 1, true);


--
-- Name: allocations_allocation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.allocations_allocation_id_seq', 1, true);


--
-- Name: analysis_profiles_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analysis_profiles_profile_id_seq', 1, false);


--
-- Name: bol_messages_bol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bol_messages_bol_id_seq', 1, false);


--
-- Name: carriers_carrier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carriers_carrier_id_seq', 1, true);


--
-- Name: crude_oil_leases_lease_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crude_oil_leases_lease_id_seq', 1, false);


--
-- Name: customers_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_customer_id_seq', 1, true);


--
-- Name: destinations_origins_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.destinations_origins_location_id_seq', 1, false);


--
-- Name: dot_messages_dot_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dot_messages_dot_message_id_seq', 1, false);


--
-- Name: drivers_driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drivers_driver_id_seq', 1, false);


--
-- Name: exstars_products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exstars_products_product_id_seq', 1, false);


--
-- Name: facility_ids_facility_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.facility_ids_facility_id_seq', 1, false);


--
-- Name: footnote_messages_footnote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.footnote_messages_footnote_id_seq', 1, false);


--
-- Name: manual_inputs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manual_inputs_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, false);


--
-- Name: rail_cars_rail_car_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rail_cars_rail_car_id_seq', 1, false);


--
-- Name: shippers_shipper_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shippers_shipper_id_seq', 1, false);


--
-- Name: strapping_tables_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.strapping_tables_id_seq', 24, true);


--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_supplier_id_seq', 1, false);


--
-- Name: tank_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tank_data_id_seq', 4, true);


--
-- Name: tank_measurements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tank_measurements_id_seq', 6, true);


--
-- Name: tracking_codes_tracking_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tracking_codes_tracking_code_id_seq', 1, false);


--
-- Name: transports_transport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transports_transport_id_seq', 1, false);


--
-- Name: additives additives_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.additives
    ADD CONSTRAINT additives_pkey PRIMARY KEY (additive_id);


--
-- Name: allocations allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.allocations
    ADD CONSTRAINT allocations_pkey PRIMARY KEY (allocation_id);


--
-- Name: analysis_profiles analysis_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analysis_profiles
    ADD CONSTRAINT analysis_profiles_pkey PRIMARY KEY (profile_id);


--
-- Name: bol_messages bol_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bol_messages
    ADD CONSTRAINT bol_messages_pkey PRIMARY KEY (bol_id);


--
-- Name: carriers carriers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carriers
    ADD CONSTRAINT carriers_pkey PRIMARY KEY (carrier_id);


--
-- Name: crude_oil_leases crude_oil_leases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crude_oil_leases
    ADD CONSTRAINT crude_oil_leases_pkey PRIMARY KEY (lease_id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- Name: destinations_origins destinations_origins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinations_origins
    ADD CONSTRAINT destinations_origins_pkey PRIMARY KEY (location_id);


--
-- Name: dot_messages dot_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dot_messages
    ADD CONSTRAINT dot_messages_pkey PRIMARY KEY (dot_message_id);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (driver_id);


--
-- Name: exstars_products exstars_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exstars_products
    ADD CONSTRAINT exstars_products_pkey PRIMARY KEY (product_id);


--
-- Name: facility_ids facility_ids_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_ids
    ADD CONSTRAINT facility_ids_pkey PRIMARY KEY (facility_id);


--
-- Name: footnote_messages footnote_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.footnote_messages
    ADD CONSTRAINT footnote_messages_pkey PRIMARY KEY (footnote_id);


--
-- Name: manual_inputs manual_inputs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manual_inputs
    ADD CONSTRAINT manual_inputs_pkey PRIMARY KEY (id);


--
-- Name: modbus_settings modbus_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modbus_settings
    ADD CONSTRAINT modbus_settings_pkey PRIMARY KEY (tank_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: rail_cars rail_cars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rail_cars
    ADD CONSTRAINT rail_cars_pkey PRIMARY KEY (rail_car_id);


--
-- Name: shippers shippers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shippers
    ADD CONSTRAINT shippers_pkey PRIMARY KEY (shipper_id);


--
-- Name: strapping_tables strapping_tables_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.strapping_tables
    ADD CONSTRAINT strapping_tables_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (supplier_id);


--
-- Name: tank_data tank_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tank_data
    ADD CONSTRAINT tank_data_pkey PRIMARY KEY (id);


--
-- Name: tank_measurements tank_measurements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tank_measurements
    ADD CONSTRAINT tank_measurements_pkey PRIMARY KEY (id);


--
-- Name: tank_products tank_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tank_products
    ADD CONSTRAINT tank_products_pkey PRIMARY KEY (tank_id);


--
-- Name: tracking_codes tracking_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_codes
    ADD CONSTRAINT tracking_codes_pkey PRIMARY KEY (tracking_code_id);


--
-- Name: transports transports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transports
    ADD CONSTRAINT transports_pkey PRIMARY KEY (transport_id);


--
-- Name: allocations allocations_tank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.allocations
    ADD CONSTRAINT allocations_tank_id_fkey FOREIGN KEY (tank_id) REFERENCES public.modbus_settings(tank_id);


--
-- Name: dot_messages dot_messages_transport_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dot_messages
    ADD CONSTRAINT dot_messages_transport_id_fkey FOREIGN KEY (transport_id) REFERENCES public.transports(transport_id);


--
-- Name: drivers drivers_carrier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_carrier_id_fkey FOREIGN KEY (carrier_id) REFERENCES public.carriers(carrier_id);


--
-- Name: footnote_messages footnote_messages_exstars_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.footnote_messages
    ADD CONSTRAINT footnote_messages_exstars_product_id_fkey FOREIGN KEY (exstars_product_id) REFERENCES public.exstars_products(product_id);


--
-- Name: rail_cars rail_cars_carrier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rail_cars
    ADD CONSTRAINT rail_cars_carrier_id_fkey FOREIGN KEY (carrier_id) REFERENCES public.carriers(carrier_id);


--
-- Name: strapping_tables strapping_tables_tank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.strapping_tables
    ADD CONSTRAINT strapping_tables_tank_id_fkey FOREIGN KEY (tank_id) REFERENCES public.tank_products(tank_id);


--
-- Name: tank_measurements tank_measurements_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tank_measurements
    ADD CONSTRAINT tank_measurements_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: tank_measurements tank_measurements_tank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tank_measurements
    ADD CONSTRAINT tank_measurements_tank_id_fkey FOREIGN KEY (tank_id) REFERENCES public.tank_products(tank_id);


--
-- Name: tank_products tank_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tank_products
    ADD CONSTRAINT tank_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: transports transports_carrier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transports
    ADD CONSTRAINT transports_carrier_id_fkey FOREIGN KEY (carrier_id) REFERENCES public.carriers(carrier_id);


--
-- PostgreSQL database dump complete
--

