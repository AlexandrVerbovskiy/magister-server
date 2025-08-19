--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2025-08-19 20:42:27

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 274 (class 1259 OID 962469)
-- Name: active_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.active_actions (
    id integer NOT NULL,
    type text NOT NULL,
    data text,
    key text,
    user_id integer NOT NULL
);


--
-- TOC entry 273 (class 1259 OID 962468)
-- Name: active_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.active_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 273
-- Name: active_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.active_actions_id_seq OWNED BY public.active_actions.id;


--
-- TOC entry 268 (class 1259 OID 962416)
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id integer NOT NULL,
    hidden boolean DEFAULT false,
    admin_send boolean DEFAULT false,
    type character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chat_id integer,
    sender_id integer
);


--
-- TOC entry 270 (class 1259 OID 962437)
-- Name: chat_messages_contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages_contents (
    id integer NOT NULL,
    content json,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    message_id integer
);


--
-- TOC entry 269 (class 1259 OID 962436)
-- Name: chat_messages_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_messages_contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 269
-- Name: chat_messages_contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_messages_contents_id_seq OWNED BY public.chat_messages_contents.id;


--
-- TOC entry 267 (class 1259 OID 962415)
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 267
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- TOC entry 266 (class 1259 OID 962396)
-- Name: chat_relations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_relations (
    id integer NOT NULL,
    typing boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chat_id integer,
    user_id integer
);


--
-- TOC entry 265 (class 1259 OID 962395)
-- Name: chat_relations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_relations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 265
-- Name: chat_relations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_relations_id_seq OWNED BY public.chat_relations.id;


--
-- TOC entry 264 (class 1259 OID 962385)
-- Name: chats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chats (
    id integer NOT NULL,
    entity_id integer,
    entity_type character varying(255),
    name text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 263 (class 1259 OID 962384)
-- Name: chats_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 263
-- Name: chats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chats_id_seq OWNED BY public.chats.id;


--
-- TOC entry 280 (class 1259 OID 962525)
-- Name: dispute_prediction_models; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dispute_prediction_models (
    id integer NOT NULL,
    accuracy integer,
    active boolean DEFAULT false,
    after_finish_active boolean DEFAULT false,
    after_finish_rebuild boolean DEFAULT false,
    started boolean DEFAULT false,
    stopped boolean DEFAULT false,
    finished boolean DEFAULT false,
    body json,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    checked boolean DEFAULT false,
    check_field character varying(255),
    training_percent integer DEFAULT 0,
    prediction_details json,
    selected_fields json,
    progress_percent integer DEFAULT 0
);


--
-- TOC entry 279 (class 1259 OID 962524)
-- Name: dispute_prediction_models_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dispute_prediction_models_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 279
-- Name: dispute_prediction_models_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dispute_prediction_models_id_seq OWNED BY public.dispute_prediction_models.id;


--
-- TOC entry 262 (class 1259 OID 962362)
-- Name: disputes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.disputes (
    id integer NOT NULL,
    solution text,
    description text,
    type character varying(255),
    status character varying(255),
    solved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    order_id integer,
    sender_id integer
);


--
-- TOC entry 261 (class 1259 OID 962361)
-- Name: disputes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.disputes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 261
-- Name: disputes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.disputes_id_seq OWNED BY public.disputes.id;


--
-- TOC entry 222 (class 1259 OID 962021)
-- Name: email_verified_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_verified_codes (
    id integer NOT NULL,
    code character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer
);


--
-- TOC entry 221 (class 1259 OID 962020)
-- Name: email_verified_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_verified_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 221
-- Name: email_verified_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_verified_codes_id_seq OWNED BY public.email_verified_codes.id;


--
-- TOC entry 216 (class 1259 OID 961979)
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


--
-- TOC entry 215 (class 1259 OID 961978)
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 215
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- TOC entry 218 (class 1259 OID 961986)
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


--
-- TOC entry 217 (class 1259 OID 961985)
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 217
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- TOC entry 248 (class 1259 OID 962221)
-- Name: listing_approval_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listing_approval_requests (
    id integer NOT NULL,
    reject_description text,
    approved boolean,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    listing_id integer
);


--
-- TOC entry 247 (class 1259 OID 962220)
-- Name: listing_approval_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.listing_approval_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 247
-- Name: listing_approval_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.listing_approval_requests_id_seq OWNED BY public.listing_approval_requests.id;


--
-- TOC entry 242 (class 1259 OID 962173)
-- Name: listing_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listing_categories (
    id integer NOT NULL,
    name character varying(255),
    level integer,
    image character varying(255) DEFAULT NULL::character varying,
    popular boolean DEFAULT false,
    order_index integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    parent_id integer
);


--
-- TOC entry 241 (class 1259 OID 962172)
-- Name: listing_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.listing_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 241
-- Name: listing_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.listing_categories_id_seq OWNED BY public.listing_categories.id;


--
-- TOC entry 250 (class 1259 OID 962237)
-- Name: listing_category_create_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listing_category_create_notifications (
    id integer NOT NULL,
    category_name text,
    sent_success boolean DEFAULT false,
    sent_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer
);


--
-- TOC entry 249 (class 1259 OID 962236)
-- Name: listing_category_create_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.listing_category_create_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 249
-- Name: listing_category_create_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.listing_category_create_notifications_id_seq OWNED BY public.listing_category_create_notifications.id;


--
-- TOC entry 246 (class 1259 OID 962207)
-- Name: listing_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listing_images (
    id integer NOT NULL,
    type character varying(255),
    link text,
    listing_id integer
);


--
-- TOC entry 245 (class 1259 OID 962206)
-- Name: listing_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.listing_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 245
-- Name: listing_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.listing_images_id_seq OWNED BY public.listing_images.id;


--
-- TOC entry 240 (class 1259 OID 962153)
-- Name: listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listings (
    id integer NOT NULL,
    name character varying(255),
    description text,
    address text,
    price real,
    postcode text,
    city character varying(255),
    lat real,
    lng real,
    radius real,
    other_category character varying(255) DEFAULT NULL::character varying,
    background_photo character varying(255) DEFAULT NULL::character varying,
    approved boolean DEFAULT false,
    category_id integer,
    other_category_parent_id integer,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    owner_id integer
);


--
-- TOC entry 239 (class 1259 OID 962152)
-- Name: listings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 239
-- Name: listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.listings_id_seq OWNED BY public.listings.id;


--
-- TOC entry 232 (class 1259 OID 962095)
-- Name: logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.logs (
    id integer NOT NULL,
    success boolean DEFAULT false,
    message text,
    body text,
    line character varying(255) DEFAULT NULL::character varying,
    symbol character varying(255) DEFAULT NULL::character varying,
    file character varying(255) DEFAULT NULL::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 962094)
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 231
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;


--
-- TOC entry 254 (class 1259 OID 962276)
-- Name: order_update_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_update_requests (
    id integer NOT NULL,
    active boolean DEFAULT true,
    new_price real,
    new_start_time timestamp with time zone,
    new_finish_time timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sender_id integer,
    order_id integer
);


--
-- TOC entry 253 (class 1259 OID 962275)
-- Name: order_update_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_update_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 253
-- Name: order_update_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_update_requests_id_seq OWNED BY public.order_update_requests.id;


--
-- TOC entry 252 (class 1259 OID 962254)
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    status text,
    cancel_status character varying(255) DEFAULT NULL::character varying,
    price real,
    start_time timestamp with time zone,
    finish_time timestamp with time zone,
    prev_price real,
    prev_start_time timestamp with time zone,
    prev_finish_time timestamp with time zone,
    renter_fee real,
    owner_fee real,
    finished_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    renter_id integer,
    listing_id integer,
    dispute_probability integer
);


--
-- TOC entry 251 (class 1259 OID 962253)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 251
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 278 (class 1259 OID 962501)
-- Name: owner_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.owner_comments (
    id integer NOT NULL,
    description text,
    leave_feedback text,
    item_description_accuracy integer,
    photo_accuracy integer,
    pickup_condition integer,
    cleanliness integer,
    responsiveness integer,
    clarity integer,
    scheduling_flexibility integer,
    issue_resolution integer,
    approved boolean DEFAULT false,
    waiting_admin boolean DEFAULT true,
    rejected_description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    order_id integer
);


--
-- TOC entry 277 (class 1259 OID 962500)
-- Name: owner_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.owner_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 277
-- Name: owner_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.owner_comments_id_seq OWNED BY public.owner_comments.id;


--
-- TOC entry 224 (class 1259 OID 962035)
-- Name: phone_verified_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.phone_verified_codes (
    id integer NOT NULL,
    code character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer
);


--
-- TOC entry 223 (class 1259 OID 962034)
-- Name: phone_verified_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.phone_verified_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 223
-- Name: phone_verified_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.phone_verified_codes_id_seq OWNED BY public.phone_verified_codes.id;


--
-- TOC entry 258 (class 1259 OID 962322)
-- Name: recipient_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipient_payments (
    id integer NOT NULL,
    money real,
    planned_time character varying(255),
    received_type character varying(255),
    status character varying(255),
    failed_details text,
    type character varying(255),
    data json,
    failed_description text,
    last_tried_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer,
    order_id integer
);


--
-- TOC entry 257 (class 1259 OID 962321)
-- Name: recipient_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipient_payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 257
-- Name: recipient_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipient_payments_id_seq OWNED BY public.recipient_payments.id;


--
-- TOC entry 276 (class 1259 OID 962483)
-- Name: renter_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.renter_comments (
    id integer NOT NULL,
    description text,
    leave_feedback text,
    care integer,
    timeliness integer,
    responsiveness integer,
    clarity integer,
    usage_guidelines integer,
    terms_of_service integer,
    honesty integer,
    reliability integer,
    satisfaction integer,
    approved boolean DEFAULT false,
    waiting_admin boolean DEFAULT true,
    rejected_description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    order_id integer
);


--
-- TOC entry 275 (class 1259 OID 962482)
-- Name: renter_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.renter_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 275
-- Name: renter_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.renter_comments_id_seq OWNED BY public.renter_comments.id;


--
-- TOC entry 244 (class 1259 OID 962191)
-- Name: searched_words; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.searched_words (
    id integer NOT NULL,
    name character varying(255),
    admin_viewed boolean DEFAULT false,
    search_count integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    listing_categories_id integer
);


--
-- TOC entry 243 (class 1259 OID 962190)
-- Name: searched_words_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.searched_words_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5261 (class 0 OID 0)
-- Dependencies: 243
-- Name: searched_words_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.searched_words_id_seq OWNED BY public.searched_words.id;


--
-- TOC entry 228 (class 1259 OID 962066)
-- Name: seeds_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seeds_status (
    id integer NOT NULL,
    seed_name character varying(255) NOT NULL,
    seed_run boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 962065)
-- Name: seeds_status_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seeds_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5262 (class 0 OID 0)
-- Dependencies: 227
-- Name: seeds_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seeds_status_id_seq OWNED BY public.seeds_status.id;


--
-- TOC entry 256 (class 1259 OID 962296)
-- Name: sender_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sender_payments (
    id integer NOT NULL,
    money real,
    payed_proof character varying(255) DEFAULT NULL::character varying,
    type character varying(255) DEFAULT NULL::character varying,
    data json,
    admin_approved boolean DEFAULT false,
    waiting_approved boolean DEFAULT true,
    failed_description text,
    due_at timestamp with time zone,
    hidden boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer,
    order_id integer
);


--
-- TOC entry 255 (class 1259 OID 962295)
-- Name: sender_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sender_payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5263 (class 0 OID 0)
-- Dependencies: 255
-- Name: sender_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sender_payments_id_seq OWNED BY public.sender_payments.id;


--
-- TOC entry 272 (class 1259 OID 962453)
-- Name: sockets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sockets (
    id integer NOT NULL,
    socket text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer
);


--
-- TOC entry 271 (class 1259 OID 962452)
-- Name: sockets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sockets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5264 (class 0 OID 0)
-- Dependencies: 271
-- Name: sockets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sockets_id_seq OWNED BY public.sockets.id;


--
-- TOC entry 238 (class 1259 OID 962144)
-- Name: system; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system (
    id integer NOT NULL,
    key text,
    value text
);


--
-- TOC entry 237 (class 1259 OID 962143)
-- Name: system_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.system_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5265 (class 0 OID 0)
-- Dependencies: 237
-- Name: system_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.system_id_seq OWNED BY public.system.id;


--
-- TOC entry 282 (class 1259 OID 989310)
-- Name: temp_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.temp_orders (
    id integer NOT NULL,
    status text,
    cancel_status character varying(255) DEFAULT NULL::character varying,
    price real,
    start_time timestamp with time zone,
    finish_time timestamp with time zone,
    prev_price real,
    prev_start_time timestamp with time zone,
    prev_finish_time timestamp with time zone,
    renter_fee real,
    owner_fee real,
    finished_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    renter_id integer,
    listing_id integer,
    dispute_probability integer
);


--
-- TOC entry 281 (class 1259 OID 989309)
-- Name: temp_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.temp_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5266 (class 0 OID 0)
-- Dependencies: 281
-- Name: temp_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.temp_orders_id_seq OWNED BY public.temp_orders.id;


--
-- TOC entry 226 (class 1259 OID 962049)
-- Name: two_factor_auth_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.two_factor_auth_codes (
    id integer NOT NULL,
    code character varying(255),
    type_verification character varying(255) DEFAULT 'email'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer
);


--
-- TOC entry 225 (class 1259 OID 962048)
-- Name: two_factor_auth_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.two_factor_auth_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5267 (class 0 OID 0)
-- Dependencies: 225
-- Name: two_factor_auth_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.two_factor_auth_codes_id_seq OWNED BY public.two_factor_auth_codes.id;


--
-- TOC entry 230 (class 1259 OID 962076)
-- Name: user_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_documents (
    id integer NOT NULL,
    user_photo character varying(255) DEFAULT NULL::character varying,
    document_front character varying(255) DEFAULT NULL::character varying,
    document_back character varying(255) DEFAULT NULL::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer
);


--
-- TOC entry 229 (class 1259 OID 962075)
-- Name: user_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5268 (class 0 OID 0)
-- Dependencies: 229
-- Name: user_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_documents_id_seq OWNED BY public.user_documents.id;


--
-- TOC entry 236 (class 1259 OID 962128)
-- Name: user_event_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_event_logs (
    id integer NOT NULL,
    user_email text,
    user_role text,
    event_name character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer
);


--
-- TOC entry 235 (class 1259 OID 962127)
-- Name: user_event_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_event_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5269 (class 0 OID 0)
-- Dependencies: 235
-- Name: user_event_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_event_logs_id_seq OWNED BY public.user_event_logs.id;


--
-- TOC entry 260 (class 1259 OID 962343)
-- Name: user_listing_favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_listing_favorites (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    listing_id integer,
    user_id integer
);


--
-- TOC entry 259 (class 1259 OID 962342)
-- Name: user_listing_favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_listing_favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5270 (class 0 OID 0)
-- Dependencies: 259
-- Name: user_listing_favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_listing_favorites_id_seq OWNED BY public.user_listing_favorites.id;


--
-- TOC entry 234 (class 1259 OID 962110)
-- Name: user_verify_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_verify_requests (
    id integer NOT NULL,
    has_response boolean DEFAULT false,
    viewed_failed_description boolean DEFAULT false,
    failed_description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer
);


--
-- TOC entry 233 (class 1259 OID 962109)
-- Name: user_verify_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_verify_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5271 (class 0 OID 0)
-- Dependencies: 233
-- Name: user_verify_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_verify_requests_id_seq OWNED BY public.user_verify_requests.id;


--
-- TOC entry 220 (class 1259 OID 961993)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    email text,
    email_verified boolean DEFAULT false,
    password character varying(255),
    role character varying(255) DEFAULT 'user'::character varying,
    brief_bio text DEFAULT ''::text,
    photo character varying(255) DEFAULT ''::character varying,
    phone character varying(255) DEFAULT NULL::character varying,
    phone_verified boolean DEFAULT false,
    need_regular_view_info_form boolean DEFAULT true,
    verified boolean DEFAULT false,
    two_factor_authentication boolean DEFAULT false,
    accepted_term_condition boolean DEFAULT false,
    active boolean DEFAULT true,
    suspicious boolean DEFAULT false,
    online boolean,
    facebook_url text,
    linkedin_url text,
    instagram_url text,
    paypal_id character varying(255) DEFAULT NULL::character varying,
    has_password_access boolean DEFAULT true,
    deleted boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 961992)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5272 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4889 (class 2604 OID 962472)
-- Name: active_actions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_actions ALTER COLUMN id SET DEFAULT nextval('public.active_actions_id_seq'::regclass);


--
-- TOC entry 4878 (class 2604 OID 962419)
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- TOC entry 4883 (class 2604 OID 962440)
-- Name: chat_messages_contents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages_contents ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_contents_id_seq'::regclass);


--
-- TOC entry 4874 (class 2604 OID 962399)
-- Name: chat_relations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_relations ALTER COLUMN id SET DEFAULT nextval('public.chat_relations_id_seq'::regclass);


--
-- TOC entry 4871 (class 2604 OID 962388)
-- Name: chats id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chats ALTER COLUMN id SET DEFAULT nextval('public.chats_id_seq'::regclass);


--
-- TOC entry 4900 (class 2604 OID 962528)
-- Name: dispute_prediction_models id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dispute_prediction_models ALTER COLUMN id SET DEFAULT nextval('public.dispute_prediction_models_id_seq'::regclass);


--
-- TOC entry 4868 (class 2604 OID 962365)
-- Name: disputes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disputes ALTER COLUMN id SET DEFAULT nextval('public.disputes_id_seq'::regclass);


--
-- TOC entry 4785 (class 2604 OID 962024)
-- Name: email_verified_codes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verified_codes ALTER COLUMN id SET DEFAULT nextval('public.email_verified_codes_id_seq'::regclass);


--
-- TOC entry 4765 (class 2604 OID 961982)
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- TOC entry 4766 (class 2604 OID 961989)
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- TOC entry 4839 (class 2604 OID 962224)
-- Name: listing_approval_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_approval_requests ALTER COLUMN id SET DEFAULT nextval('public.listing_approval_requests_id_seq'::regclass);


--
-- TOC entry 4828 (class 2604 OID 962176)
-- Name: listing_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_categories ALTER COLUMN id SET DEFAULT nextval('public.listing_categories_id_seq'::regclass);


--
-- TOC entry 4842 (class 2604 OID 962240)
-- Name: listing_category_create_notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_category_create_notifications ALTER COLUMN id SET DEFAULT nextval('public.listing_category_create_notifications_id_seq'::regclass);


--
-- TOC entry 4838 (class 2604 OID 962210)
-- Name: listing_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_images ALTER COLUMN id SET DEFAULT nextval('public.listing_images_id_seq'::regclass);


--
-- TOC entry 4821 (class 2604 OID 962156)
-- Name: listings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings ALTER COLUMN id SET DEFAULT nextval('public.listings_id_seq'::regclass);


--
-- TOC entry 4805 (class 2604 OID 962098)
-- Name: logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);


--
-- TOC entry 4850 (class 2604 OID 962279)
-- Name: order_update_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_update_requests ALTER COLUMN id SET DEFAULT nextval('public.order_update_requests_id_seq'::regclass);


--
-- TOC entry 4846 (class 2604 OID 962257)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4895 (class 2604 OID 962504)
-- Name: owner_comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owner_comments ALTER COLUMN id SET DEFAULT nextval('public.owner_comments_id_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 962038)
-- Name: phone_verified_codes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phone_verified_codes ALTER COLUMN id SET DEFAULT nextval('public.phone_verified_codes_id_seq'::regclass);


--
-- TOC entry 4862 (class 2604 OID 962325)
-- Name: recipient_payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipient_payments ALTER COLUMN id SET DEFAULT nextval('public.recipient_payments_id_seq'::regclass);


--
-- TOC entry 4890 (class 2604 OID 962486)
-- Name: renter_comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.renter_comments ALTER COLUMN id SET DEFAULT nextval('public.renter_comments_id_seq'::regclass);


--
-- TOC entry 4833 (class 2604 OID 962194)
-- Name: searched_words id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.searched_words ALTER COLUMN id SET DEFAULT nextval('public.searched_words_id_seq'::regclass);


--
-- TOC entry 4795 (class 2604 OID 962069)
-- Name: seeds_status id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeds_status ALTER COLUMN id SET DEFAULT nextval('public.seeds_status_id_seq'::regclass);


--
-- TOC entry 4854 (class 2604 OID 962299)
-- Name: sender_payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sender_payments ALTER COLUMN id SET DEFAULT nextval('public.sender_payments_id_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 962456)
-- Name: sockets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sockets ALTER COLUMN id SET DEFAULT nextval('public.sockets_id_seq'::regclass);


--
-- TOC entry 4820 (class 2604 OID 962147)
-- Name: system id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system ALTER COLUMN id SET DEFAULT nextval('public.system_id_seq'::regclass);


--
-- TOC entry 4912 (class 2604 OID 989313)
-- Name: temp_orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.temp_orders ALTER COLUMN id SET DEFAULT nextval('public.temp_orders_id_seq'::regclass);


--
-- TOC entry 4791 (class 2604 OID 962052)
-- Name: two_factor_auth_codes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.two_factor_auth_codes ALTER COLUMN id SET DEFAULT nextval('public.two_factor_auth_codes_id_seq'::regclass);


--
-- TOC entry 4799 (class 2604 OID 962079)
-- Name: user_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_documents ALTER COLUMN id SET DEFAULT nextval('public.user_documents_id_seq'::regclass);


--
-- TOC entry 4817 (class 2604 OID 962131)
-- Name: user_event_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_event_logs ALTER COLUMN id SET DEFAULT nextval('public.user_event_logs_id_seq'::regclass);


--
-- TOC entry 4865 (class 2604 OID 962346)
-- Name: user_listing_favorites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_listing_favorites ALTER COLUMN id SET DEFAULT nextval('public.user_listing_favorites_id_seq'::regclass);


--
-- TOC entry 4812 (class 2604 OID 962113)
-- Name: user_verify_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_verify_requests ALTER COLUMN id SET DEFAULT nextval('public.user_verify_requests_id_seq'::regclass);


--
-- TOC entry 4767 (class 2604 OID 961996)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5225 (class 0 OID 962469)
-- Dependencies: 274
-- Data for Name: active_actions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5219 (class 0 OID 962416)
-- Dependencies: 268
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.chat_messages VALUES (1, false, false, 'new-order', '2025-08-10 12:44:29.648616+02', '2025-08-10 12:44:29.648616+02', 1, 2);
INSERT INTO public.chat_messages VALUES (2, false, false, 'new-order', '2025-08-18 17:31:01.436312+02', '2025-08-18 17:31:01.436312+02', 2, 4);
INSERT INTO public.chat_messages VALUES (3, false, false, 'text', '2025-08-18 17:35:54.200759+02', '2025-08-18 17:35:54.200759+02', 2, 3);
INSERT INTO public.chat_messages VALUES (4, false, false, 'accepted-order', '2025-08-18 17:58:46.193359+02', '2025-08-18 17:58:46.193359+02', 2, 3);
INSERT INTO public.chat_messages VALUES (5, false, false, 'renter-payed', '2025-08-18 18:10:12.055866+02', '2025-08-18 18:10:12.055866+02', 2, 3);
INSERT INTO public.chat_messages VALUES (6, false, false, 'new-order', '2025-08-18 18:28:45.514925+02', '2025-08-18 18:28:45.514925+02', 3, 4);
INSERT INTO public.chat_messages VALUES (7, false, false, 'accepted-order', '2025-08-18 18:28:59.676485+02', '2025-08-18 18:28:59.676485+02', 3, 3);
INSERT INTO public.chat_messages VALUES (8, false, false, 'renter-payed', '2025-08-18 18:31:05.576354+02', '2025-08-18 18:31:05.576354+02', 3, 4);
INSERT INTO public.chat_messages VALUES (9, false, false, 'waiting-finished-approve', '2025-08-18 18:31:22.110864+02', '2025-08-18 18:31:22.110864+02', 3, 4);
INSERT INTO public.chat_messages VALUES (10, false, false, 'text', '2025-08-18 18:31:40.859313+02', '2025-08-18 18:31:40.859313+02', 3, 3);
INSERT INTO public.chat_messages VALUES (11, false, false, 'text', '2025-08-18 18:31:47.031462+02', '2025-08-18 18:31:47.031462+02', 3, 4);
INSERT INTO public.chat_messages VALUES (12, false, false, 'finished', '2025-08-18 18:31:54.168188+02', '2025-08-18 18:31:54.168188+02', 3, 3);
INSERT INTO public.chat_messages VALUES (13, false, false, 'owner-review', '2025-08-18 18:32:13.603801+02', '2025-08-18 18:32:13.603801+02', 3, 4);
INSERT INTO public.chat_messages VALUES (14, false, false, 'renter-review', '2025-08-18 18:33:15.324887+02', '2025-08-18 18:33:15.324887+02', 3, 3);
INSERT INTO public.chat_messages VALUES (15, false, false, 'new-order', '2025-08-18 18:36:30.017568+02', '2025-08-18 18:36:30.017568+02', 4, 4);
INSERT INTO public.chat_messages VALUES (16, false, false, 'accepted-order', '2025-08-18 18:36:43.300296+02', '2025-08-18 18:36:43.300296+02', 4, 3);
INSERT INTO public.chat_messages VALUES (17, false, false, 'renter-payed', '2025-08-18 18:37:06.496816+02', '2025-08-18 18:37:06.496816+02', 4, 4);
INSERT INTO public.chat_messages VALUES (18, false, false, 'started-dispute', '2025-08-18 18:37:30.166331+02', '2025-08-18 18:37:30.166331+02', 5, NULL);
INSERT INTO public.chat_messages VALUES (19, false, false, 'started-dispute', '2025-08-18 18:37:30.17335+02', '2025-08-18 18:37:30.17335+02', 6, NULL);
INSERT INTO public.chat_messages VALUES (20, false, false, 'started-dispute', '2025-08-18 18:37:30.183865+02', '2025-08-18 18:37:30.183865+02', 4, 4);
INSERT INTO public.chat_messages VALUES (21, false, false, 'new-order', '2025-08-18 18:39:23.35715+02', '2025-08-18 18:39:23.35715+02', 7, 4);
INSERT INTO public.chat_messages VALUES (22, false, false, 'update-order', '2025-08-18 18:39:35.764912+02', '2025-08-18 18:39:35.764912+02', 7, 3);
INSERT INTO public.chat_messages VALUES (23, false, false, 'accepted-order', '2025-08-18 18:39:41.387439+02', '2025-08-18 18:39:41.387439+02', 7, 4);
INSERT INTO public.chat_messages VALUES (24, false, false, 'renter-payed', '2025-08-18 18:39:54.546641+02', '2025-08-18 18:39:54.546641+02', 7, 4);
INSERT INTO public.chat_messages VALUES (25, false, false, 'waiting-finished-approve', '2025-08-18 18:40:03.211783+02', '2025-08-18 18:40:03.211783+02', 7, 4);
INSERT INTO public.chat_messages VALUES (26, false, false, 'started-dispute', '2025-08-18 18:40:26.427812+02', '2025-08-18 18:40:26.427812+02', 8, NULL);
INSERT INTO public.chat_messages VALUES (27, false, false, 'started-dispute', '2025-08-18 18:40:26.43503+02', '2025-08-18 18:40:26.43503+02', 9, NULL);
INSERT INTO public.chat_messages VALUES (28, false, false, 'started-dispute', '2025-08-18 18:40:26.441773+02', '2025-08-18 18:40:26.441773+02', 7, 3);
INSERT INTO public.chat_messages VALUES (29, false, false, 'new-order', '2025-08-18 18:43:31.116234+02', '2025-08-18 18:43:31.116234+02', 10, 4);
INSERT INTO public.chat_messages VALUES (30, false, false, 'text', '2025-08-18 18:44:21.669529+02', '2025-08-18 18:44:21.669529+02', 10, 6);
INSERT INTO public.chat_messages VALUES (31, false, false, 'accepted-order', '2025-08-18 18:44:22.972856+02', '2025-08-18 18:44:22.972856+02', 10, 6);
INSERT INTO public.chat_messages VALUES (32, false, false, 'renter-payed', '2025-08-18 18:48:55.560969+02', '2025-08-18 18:48:55.560969+02', 10, 4);
INSERT INTO public.chat_messages VALUES (33, false, false, 'waiting-finished-approve', '2025-08-18 18:49:04.793547+02', '2025-08-18 18:49:04.793547+02', 10, 4);
INSERT INTO public.chat_messages VALUES (34, false, false, 'finished', '2025-08-18 18:53:05.616092+02', '2025-08-18 18:53:05.616092+02', 10, 6);
INSERT INTO public.chat_messages VALUES (35, false, false, 'renter-review', '2025-08-18 18:53:23.555841+02', '2025-08-18 18:53:23.555841+02', 10, 6);
INSERT INTO public.chat_messages VALUES (36, false, false, 'new-order', '2025-08-18 18:53:53.26681+02', '2025-08-18 18:53:53.26681+02', 11, 4);
INSERT INTO public.chat_messages VALUES (37, false, false, 'update-order', '2025-08-18 18:54:14.981129+02', '2025-08-18 18:54:14.981129+02', 11, 6);
INSERT INTO public.chat_messages VALUES (38, false, false, 'accepted-order', '2025-08-18 18:54:23.870958+02', '2025-08-18 18:54:23.870958+02', 11, 4);
INSERT INTO public.chat_messages VALUES (39, false, false, 'renter-payed', '2025-08-18 18:55:30.136789+02', '2025-08-18 18:55:30.136789+02', 11, 4);
INSERT INTO public.chat_messages VALUES (40, false, false, 'renter-payed', '2025-08-18 18:56:09.575327+02', '2025-08-18 18:56:09.575327+02', 11, 6);
INSERT INTO public.chat_messages VALUES (41, false, false, 'started-dispute', '2025-08-18 18:56:54.168535+02', '2025-08-18 18:56:54.168535+02', 12, NULL);
INSERT INTO public.chat_messages VALUES (42, false, false, 'started-dispute', '2025-08-18 18:56:54.174482+02', '2025-08-18 18:56:54.174482+02', 13, NULL);
INSERT INTO public.chat_messages VALUES (43, false, false, 'started-dispute', '2025-08-18 18:56:54.181853+02', '2025-08-18 18:56:54.181853+02', 11, 6);
INSERT INTO public.chat_messages VALUES (44, false, false, 'new-order', '2025-08-18 19:06:52.845173+02', '2025-08-18 19:06:52.845173+02', 14, 4);
INSERT INTO public.chat_messages VALUES (45, false, false, 'accepted-order', '2025-08-18 19:07:06.840899+02', '2025-08-18 19:07:06.840899+02', 14, 6);
INSERT INTO public.chat_messages VALUES (46, false, false, 'renter-payed', '2025-08-18 19:08:10.719039+02', '2025-08-18 19:08:10.719039+02', 14, 4);
INSERT INTO public.chat_messages VALUES (47, false, false, 'waiting-finished-approve', '2025-08-18 19:08:15.018342+02', '2025-08-18 19:08:15.018342+02', 14, 4);
INSERT INTO public.chat_messages VALUES (48, false, false, 'finished', '2025-08-18 19:08:22.273646+02', '2025-08-18 19:08:22.273646+02', 14, 6);
INSERT INTO public.chat_messages VALUES (49, false, false, 'new-order', '2025-08-18 19:08:47.608575+02', '2025-08-18 19:08:47.608575+02', 15, 4);
INSERT INTO public.chat_messages VALUES (50, false, false, 'update-order', '2025-08-18 19:09:02.076505+02', '2025-08-18 19:09:02.076505+02', 15, 6);
INSERT INTO public.chat_messages VALUES (51, false, false, 'update-order', '2025-08-18 19:09:18.146807+02', '2025-08-18 19:09:18.146807+02', 15, 4);
INSERT INTO public.chat_messages VALUES (52, false, false, 'accepted-order', '2025-08-18 19:09:24.910723+02', '2025-08-18 19:09:24.910723+02', 15, 6);
INSERT INTO public.chat_messages VALUES (53, false, false, 'renter-payed', '2025-08-18 19:09:51.876126+02', '2025-08-18 19:09:51.876126+02', 15, 4);
INSERT INTO public.chat_messages VALUES (54, false, false, 'started-dispute', '2025-08-18 19:10:04.727288+02', '2025-08-18 19:10:04.727288+02', 16, NULL);
INSERT INTO public.chat_messages VALUES (55, false, false, 'started-dispute', '2025-08-18 19:10:04.734525+02', '2025-08-18 19:10:04.734525+02', 17, NULL);
INSERT INTO public.chat_messages VALUES (56, false, false, 'started-dispute', '2025-08-18 19:10:04.745028+02', '2025-08-18 19:10:04.745028+02', 15, 4);
INSERT INTO public.chat_messages VALUES (57, false, false, 'new-order', '2025-08-18 19:11:21.053334+02', '2025-08-18 19:11:21.053334+02', 18, 4);
INSERT INTO public.chat_messages VALUES (58, false, false, 'accepted-order', '2025-08-18 19:12:05.265739+02', '2025-08-18 19:12:05.265739+02', 18, 3);
INSERT INTO public.chat_messages VALUES (59, false, false, 'renter-payed', '2025-08-18 19:12:21.767923+02', '2025-08-18 19:12:21.767923+02', 18, 4);
INSERT INTO public.chat_messages VALUES (60, false, false, 'waiting-finished-approve', '2025-08-18 19:12:25.934199+02', '2025-08-18 19:12:25.934199+02', 18, 4);
INSERT INTO public.chat_messages VALUES (61, false, false, 'started-dispute', '2025-08-18 19:12:52.436617+02', '2025-08-18 19:12:52.436617+02', 19, NULL);
INSERT INTO public.chat_messages VALUES (62, false, false, 'started-dispute', '2025-08-18 19:12:52.443407+02', '2025-08-18 19:12:52.443407+02', 20, NULL);
INSERT INTO public.chat_messages VALUES (63, false, false, 'started-dispute', '2025-08-18 19:12:52.451571+02', '2025-08-18 19:12:52.451571+02', 18, 3);
INSERT INTO public.chat_messages VALUES (64, false, false, 'new-order', '2025-08-18 19:13:42.442959+02', '2025-08-18 19:13:42.442959+02', 21, 4);
INSERT INTO public.chat_messages VALUES (65, false, false, 'accepted-order', '2025-08-18 19:13:51.042848+02', '2025-08-18 19:13:51.042848+02', 21, 3);
INSERT INTO public.chat_messages VALUES (66, false, false, 'renter-payed', '2025-08-18 19:14:03.990399+02', '2025-08-18 19:14:03.990399+02', 21, 4);
INSERT INTO public.chat_messages VALUES (67, false, false, 'renter-payed', '2025-08-18 19:14:15.059386+02', '2025-08-18 19:14:15.059386+02', 21, 3);
INSERT INTO public.chat_messages VALUES (68, false, false, 'waiting-finished-approve', '2025-08-18 19:14:22.33898+02', '2025-08-18 19:14:22.33898+02', 21, 4);
INSERT INTO public.chat_messages VALUES (69, false, false, 'started-dispute', '2025-08-18 19:14:31.476521+02', '2025-08-18 19:14:31.476521+02', 22, NULL);
INSERT INTO public.chat_messages VALUES (70, false, false, 'started-dispute', '2025-08-18 19:14:31.481467+02', '2025-08-18 19:14:31.481467+02', 23, NULL);
INSERT INTO public.chat_messages VALUES (71, false, false, 'started-dispute', '2025-08-18 19:14:31.488798+02', '2025-08-18 19:14:31.488798+02', 21, 4);
INSERT INTO public.chat_messages VALUES (72, false, false, 'new-order', '2025-08-18 19:14:52.50888+02', '2025-08-18 19:14:52.50888+02', 24, 4);
INSERT INTO public.chat_messages VALUES (73, false, false, 'update-order', '2025-08-18 19:15:39.595765+02', '2025-08-18 19:15:39.595765+02', 24, 3);
INSERT INTO public.chat_messages VALUES (74, false, false, 'update-order', '2025-08-18 19:15:53.998928+02', '2025-08-18 19:15:53.998928+02', 24, 4);
INSERT INTO public.chat_messages VALUES (75, false, false, 'accepted-order', '2025-08-18 19:16:00.467579+02', '2025-08-18 19:16:00.467579+02', 24, 3);
INSERT INTO public.chat_messages VALUES (76, false, false, 'renter-payed', '2025-08-18 19:16:12.176702+02', '2025-08-18 19:16:12.176702+02', 24, 4);
INSERT INTO public.chat_messages VALUES (77, false, false, 'renter-payed', '2025-08-18 19:17:17.802541+02', '2025-08-18 19:17:17.802541+02', 24, 3);
INSERT INTO public.chat_messages VALUES (78, false, false, 'started-dispute', '2025-08-18 19:17:28.594325+02', '2025-08-18 19:17:28.594325+02', 25, NULL);
INSERT INTO public.chat_messages VALUES (79, false, false, 'started-dispute', '2025-08-18 19:17:28.600283+02', '2025-08-18 19:17:28.600283+02', 26, NULL);
INSERT INTO public.chat_messages VALUES (80, false, false, 'started-dispute', '2025-08-18 19:17:28.609707+02', '2025-08-18 19:17:28.609707+02', 24, 3);
INSERT INTO public.chat_messages VALUES (81, false, false, 'new-order', '2025-08-18 19:26:31.747065+02', '2025-08-18 19:26:31.747065+02', 27, 4);
INSERT INTO public.chat_messages VALUES (82, false, false, 'accepted-order', '2025-08-18 19:26:41.537465+02', '2025-08-18 19:26:41.537465+02', 27, 3);
INSERT INTO public.chat_messages VALUES (83, false, false, 'renter-payed', '2025-08-18 19:27:07.296386+02', '2025-08-18 19:27:07.296386+02', 27, 4);
INSERT INTO public.chat_messages VALUES (84, false, false, 'waiting-finished-approve', '2025-08-18 19:27:16.57866+02', '2025-08-18 19:27:16.57866+02', 27, 4);
INSERT INTO public.chat_messages VALUES (85, false, false, 'started-dispute', '2025-08-18 19:27:29.621528+02', '2025-08-18 19:27:29.621528+02', 28, NULL);
INSERT INTO public.chat_messages VALUES (86, false, false, 'started-dispute', '2025-08-18 19:27:29.627516+02', '2025-08-18 19:27:29.627516+02', 29, NULL);
INSERT INTO public.chat_messages VALUES (87, false, false, 'started-dispute', '2025-08-18 19:27:29.635065+02', '2025-08-18 19:27:29.635065+02', 27, 3);
INSERT INTO public.chat_messages VALUES (88, false, false, 'new-order', '2025-08-19 17:29:11.273308+02', '2025-08-19 17:29:11.273308+02', 30, 5);
INSERT INTO public.chat_messages VALUES (89, false, false, 'update-order', '2025-08-19 17:29:28.235661+02', '2025-08-19 17:29:28.235661+02', 30, 3);
INSERT INTO public.chat_messages VALUES (90, false, false, 'accepted-order', '2025-08-19 17:29:35.701819+02', '2025-08-19 17:29:35.701819+02', 30, 5);
INSERT INTO public.chat_messages VALUES (91, false, false, 'renter-payed', '2025-08-19 17:32:32.60779+02', '2025-08-19 17:32:32.60779+02', 30, 5);
INSERT INTO public.chat_messages VALUES (92, false, false, 'started-dispute', '2025-08-19 17:32:44.655534+02', '2025-08-19 17:32:44.655534+02', 31, NULL);
INSERT INTO public.chat_messages VALUES (93, false, false, 'started-dispute', '2025-08-19 17:32:44.662503+02', '2025-08-19 17:32:44.662503+02', 32, NULL);
INSERT INTO public.chat_messages VALUES (94, false, false, 'started-dispute', '2025-08-19 17:32:44.672348+02', '2025-08-19 17:32:44.672348+02', 30, 5);
INSERT INTO public.chat_messages VALUES (95, false, false, 'new-order', '2025-08-19 17:34:56.786841+02', '2025-08-19 17:34:56.786841+02', 33, 5);
INSERT INTO public.chat_messages VALUES (96, false, false, 'update-order', '2025-08-19 17:37:54.00351+02', '2025-08-19 17:37:54.00351+02', 33, 3);
INSERT INTO public.chat_messages VALUES (97, false, false, 'update-order', '2025-08-19 17:38:05.147013+02', '2025-08-19 17:38:05.147013+02', 33, 5);
INSERT INTO public.chat_messages VALUES (98, false, false, 'accepted-order', '2025-08-19 17:38:11.061432+02', '2025-08-19 17:38:11.061432+02', 33, 3);
INSERT INTO public.chat_messages VALUES (99, false, false, 'renter-payed', '2025-08-19 17:38:27.200012+02', '2025-08-19 17:38:27.200012+02', 33, 5);
INSERT INTO public.chat_messages VALUES (100, false, false, 'renter-payed', '2025-08-19 17:41:08.468528+02', '2025-08-19 17:41:08.468528+02', 33, 3);
INSERT INTO public.chat_messages VALUES (101, false, false, 'started-dispute', '2025-08-19 17:41:24.751589+02', '2025-08-19 17:41:24.751589+02', 34, NULL);
INSERT INTO public.chat_messages VALUES (102, false, false, 'started-dispute', '2025-08-19 17:41:24.75817+02', '2025-08-19 17:41:24.75817+02', 35, NULL);
INSERT INTO public.chat_messages VALUES (103, false, false, 'started-dispute', '2025-08-19 17:41:24.763558+02', '2025-08-19 17:41:24.763558+02', 33, 3);
INSERT INTO public.chat_messages VALUES (104, false, false, 'new-order', '2025-08-19 17:45:21.312495+02', '2025-08-19 17:45:21.312495+02', 36, 8);
INSERT INTO public.chat_messages VALUES (105, false, false, 'update-order', '2025-08-19 17:45:39.715443+02', '2025-08-19 17:45:39.715443+02', 36, 3);
INSERT INTO public.chat_messages VALUES (106, false, false, 'update-order', '2025-08-19 17:45:54.743516+02', '2025-08-19 17:45:54.743516+02', 36, 8);
INSERT INTO public.chat_messages VALUES (107, false, false, 'accepted-order', '2025-08-19 17:46:05.491883+02', '2025-08-19 17:46:05.491883+02', 36, 3);
INSERT INTO public.chat_messages VALUES (108, false, false, 'renter-payed', '2025-08-19 17:46:48.44252+02', '2025-08-19 17:46:48.44252+02', 36, 8);
INSERT INTO public.chat_messages VALUES (109, false, false, 'waiting-finished-approve', '2025-08-19 17:46:54.595788+02', '2025-08-19 17:46:54.595788+02', 36, 8);
INSERT INTO public.chat_messages VALUES (110, false, false, 'finished', '2025-08-19 17:47:05.097777+02', '2025-08-19 17:47:05.097777+02', 36, 3);
INSERT INTO public.chat_messages VALUES (111, false, false, 'new-order', '2025-08-19 17:49:16.366309+02', '2025-08-19 17:49:16.366309+02', 37, 8);
INSERT INTO public.chat_messages VALUES (112, false, false, 'accepted-order', '2025-08-19 17:49:47.37483+02', '2025-08-19 17:49:47.37483+02', 37, 16);
INSERT INTO public.chat_messages VALUES (113, false, false, 'renter-payed', '2025-08-19 17:50:01.557919+02', '2025-08-19 17:50:01.557919+02', 37, 8);
INSERT INTO public.chat_messages VALUES (114, false, false, 'renter-payed', '2025-08-19 17:51:36.727451+02', '2025-08-19 17:51:36.727451+02', 37, 16);
INSERT INTO public.chat_messages VALUES (115, false, false, 'waiting-finished-approve', '2025-08-19 17:51:42.221704+02', '2025-08-19 17:51:42.221704+02', 37, 8);
INSERT INTO public.chat_messages VALUES (116, false, false, 'finished', '2025-08-19 17:51:46.237754+02', '2025-08-19 17:51:46.237754+02', 37, 16);
INSERT INTO public.chat_messages VALUES (117, false, false, 'new-order', '2025-08-19 17:52:24.256534+02', '2025-08-19 17:52:24.256534+02', 38, 5);
INSERT INTO public.chat_messages VALUES (118, false, false, 'update-order', '2025-08-19 17:52:42.176929+02', '2025-08-19 17:52:42.176929+02', 38, 16);
INSERT INTO public.chat_messages VALUES (119, false, false, 'accepted-order', '2025-08-19 17:52:48.175459+02', '2025-08-19 17:52:48.175459+02', 38, 5);
INSERT INTO public.chat_messages VALUES (120, false, false, 'renter-payed', '2025-08-19 17:53:28.92145+02', '2025-08-19 17:53:28.92145+02', 38, 5);
INSERT INTO public.chat_messages VALUES (121, false, false, 'waiting-finished-approve', '2025-08-19 17:53:32.929177+02', '2025-08-19 17:53:32.929177+02', 38, 5);
INSERT INTO public.chat_messages VALUES (122, false, false, 'started-dispute', '2025-08-19 17:53:45.802417+02', '2025-08-19 17:53:45.802417+02', 39, NULL);
INSERT INTO public.chat_messages VALUES (123, false, false, 'started-dispute', '2025-08-19 17:53:45.805038+02', '2025-08-19 17:53:45.805038+02', 40, NULL);
INSERT INTO public.chat_messages VALUES (124, false, false, 'started-dispute', '2025-08-19 17:53:45.807402+02', '2025-08-19 17:53:45.807402+02', 38, 16);
INSERT INTO public.chat_messages VALUES (125, false, false, 'new-order', '2025-08-19 18:00:59.650728+02', '2025-08-19 18:00:59.650728+02', 41, 9);
INSERT INTO public.chat_messages VALUES (126, false, false, 'accepted-order', '2025-08-19 18:01:07.959865+02', '2025-08-19 18:01:07.959865+02', 41, 10);
INSERT INTO public.chat_messages VALUES (127, false, false, 'renter-payed', '2025-08-19 18:01:28.505862+02', '2025-08-19 18:01:28.505862+02', 41, 9);
INSERT INTO public.chat_messages VALUES (128, false, false, 'started-dispute', '2025-08-19 18:01:38.035475+02', '2025-08-19 18:01:38.035475+02', 42, NULL);
INSERT INTO public.chat_messages VALUES (129, false, false, 'started-dispute', '2025-08-19 18:01:38.039653+02', '2025-08-19 18:01:38.039653+02', 43, NULL);
INSERT INTO public.chat_messages VALUES (130, false, false, 'started-dispute', '2025-08-19 18:01:38.042319+02', '2025-08-19 18:01:38.042319+02', 41, 9);
INSERT INTO public.chat_messages VALUES (131, false, false, 'new-order', '2025-08-19 18:02:16.145409+02', '2025-08-19 18:02:16.145409+02', 44, 11);
INSERT INTO public.chat_messages VALUES (132, false, false, 'accepted-order', '2025-08-19 18:02:35.417414+02', '2025-08-19 18:02:35.417414+02', 44, 10);
INSERT INTO public.chat_messages VALUES (133, false, false, 'renter-payed', '2025-08-19 18:03:13.455787+02', '2025-08-19 18:03:13.455787+02', 44, 11);
INSERT INTO public.chat_messages VALUES (134, false, false, 'started-dispute', '2025-08-19 18:03:29.366382+02', '2025-08-19 18:03:29.366382+02', 45, NULL);
INSERT INTO public.chat_messages VALUES (135, false, false, 'started-dispute', '2025-08-19 18:03:29.369558+02', '2025-08-19 18:03:29.369558+02', 46, NULL);
INSERT INTO public.chat_messages VALUES (136, false, false, 'started-dispute', '2025-08-19 18:03:29.372826+02', '2025-08-19 18:03:29.372826+02', 44, 11);
INSERT INTO public.chat_messages VALUES (137, false, false, 'new-order', '2025-08-19 18:04:10.712919+02', '2025-08-19 18:04:10.712919+02', 47, 9);
INSERT INTO public.chat_messages VALUES (138, false, false, 'update-order', '2025-08-19 18:04:28.862153+02', '2025-08-19 18:04:28.862153+02', 47, 10);
INSERT INTO public.chat_messages VALUES (139, false, false, 'accepted-order', '2025-08-19 18:04:38.924972+02', '2025-08-19 18:04:38.924972+02', 47, 9);
INSERT INTO public.chat_messages VALUES (140, false, false, 'renter-payed', '2025-08-19 18:04:47.136508+02', '2025-08-19 18:04:47.136508+02', 47, 9);
INSERT INTO public.chat_messages VALUES (141, false, false, 'renter-payed', '2025-08-19 18:05:04.964773+02', '2025-08-19 18:05:04.964773+02', 47, 10);
INSERT INTO public.chat_messages VALUES (142, false, false, 'started-dispute', '2025-08-19 18:05:14.059073+02', '2025-08-19 18:05:14.059073+02', 48, NULL);
INSERT INTO public.chat_messages VALUES (143, false, false, 'started-dispute', '2025-08-19 18:05:14.061656+02', '2025-08-19 18:05:14.061656+02', 49, NULL);
INSERT INTO public.chat_messages VALUES (144, false, false, 'started-dispute', '2025-08-19 18:05:14.066978+02', '2025-08-19 18:05:14.066978+02', 47, 9);
INSERT INTO public.chat_messages VALUES (145, false, false, 'new-order', '2025-08-19 18:05:34.850863+02', '2025-08-19 18:05:34.850863+02', 50, 11);
INSERT INTO public.chat_messages VALUES (146, false, false, 'accepted-order', '2025-08-19 18:05:59.437687+02', '2025-08-19 18:05:59.437687+02', 50, 10);
INSERT INTO public.chat_messages VALUES (147, false, false, 'renter-payed', '2025-08-19 18:06:18.408704+02', '2025-08-19 18:06:18.408704+02', 50, 11);
INSERT INTO public.chat_messages VALUES (148, false, false, 'waiting-finished-approve', '2025-08-19 18:06:23.616943+02', '2025-08-19 18:06:23.616943+02', 50, 11);
INSERT INTO public.chat_messages VALUES (149, false, false, 'started-dispute', '2025-08-19 18:06:29.243503+02', '2025-08-19 18:06:29.243503+02', 51, NULL);
INSERT INTO public.chat_messages VALUES (150, false, false, 'started-dispute', '2025-08-19 18:06:29.246611+02', '2025-08-19 18:06:29.246611+02', 52, NULL);
INSERT INTO public.chat_messages VALUES (151, false, false, 'started-dispute', '2025-08-19 18:06:29.249117+02', '2025-08-19 18:06:29.249117+02', 50, 11);
INSERT INTO public.chat_messages VALUES (152, false, false, 'new-order', '2025-08-19 18:10:56.039028+02', '2025-08-19 18:10:56.039028+02', 53, 9);
INSERT INTO public.chat_messages VALUES (153, false, false, 'accepted-order', '2025-08-19 18:11:04.071291+02', '2025-08-19 18:11:04.071291+02', 53, 10);
INSERT INTO public.chat_messages VALUES (154, false, false, 'renter-payed', '2025-08-19 18:11:26.04926+02', '2025-08-19 18:11:26.04926+02', 53, 9);
INSERT INTO public.chat_messages VALUES (155, false, false, 'waiting-finished-approve', '2025-08-19 18:11:36.587859+02', '2025-08-19 18:11:36.587859+02', 53, 9);
INSERT INTO public.chat_messages VALUES (156, false, false, 'finished', '2025-08-19 18:11:43.027659+02', '2025-08-19 18:11:43.027659+02', 53, 10);
INSERT INTO public.chat_messages VALUES (157, false, false, 'new-order', '2025-08-19 18:15:20.681199+02', '2025-08-19 18:15:20.681199+02', 54, 11);
INSERT INTO public.chat_messages VALUES (158, false, false, 'new-order', '2025-08-19 18:15:33.494182+02', '2025-08-19 18:15:33.494182+02', 55, 9);
INSERT INTO public.chat_messages VALUES (159, false, false, 'accepted-order', '2025-08-19 18:15:45.233848+02', '2025-08-19 18:15:45.233848+02', 54, 7);
INSERT INTO public.chat_messages VALUES (160, false, false, 'accepted-order', '2025-08-19 18:15:47.821218+02', '2025-08-19 18:15:47.821218+02', 55, 7);
INSERT INTO public.chat_messages VALUES (161, false, false, 'renter-payed', '2025-08-19 18:16:06.639887+02', '2025-08-19 18:16:06.639887+02', 54, 11);
INSERT INTO public.chat_messages VALUES (162, false, false, 'renter-payed', '2025-08-19 18:16:21.370387+02', '2025-08-19 18:16:21.370387+02', 55, 9);
INSERT INTO public.chat_messages VALUES (163, false, false, 'started-dispute', '2025-08-19 18:16:51.596723+02', '2025-08-19 18:16:51.596723+02', 56, NULL);
INSERT INTO public.chat_messages VALUES (164, false, false, 'started-dispute', '2025-08-19 18:16:51.599275+02', '2025-08-19 18:16:51.599275+02', 57, NULL);
INSERT INTO public.chat_messages VALUES (165, false, false, 'started-dispute', '2025-08-19 18:16:51.601269+02', '2025-08-19 18:16:51.601269+02', 55, 7);
INSERT INTO public.chat_messages VALUES (166, false, false, 'waiting-finished-approve', '2025-08-19 18:16:57.983166+02', '2025-08-19 18:16:57.983166+02', 54, 11);
INSERT INTO public.chat_messages VALUES (167, false, false, 'finished', '2025-08-19 18:17:02.915682+02', '2025-08-19 18:17:02.915682+02', 54, 7);
INSERT INTO public.chat_messages VALUES (168, false, false, 'new-order', '2025-08-19 18:26:42.275094+02', '2025-08-19 18:26:42.275094+02', 58, 13);
INSERT INTO public.chat_messages VALUES (169, false, false, 'accepted-order', '2025-08-19 18:27:08.321947+02', '2025-08-19 18:27:08.321947+02', 58, 12);
INSERT INTO public.chat_messages VALUES (170, false, false, 'renter-payed', '2025-08-19 18:27:23.179843+02', '2025-08-19 18:27:23.179843+02', 58, 13);
INSERT INTO public.chat_messages VALUES (171, false, false, 'waiting-finished-approve', '2025-08-19 18:27:34.314548+02', '2025-08-19 18:27:34.314548+02', 58, 13);
INSERT INTO public.chat_messages VALUES (172, false, false, 'finished', '2025-08-19 18:27:42.367407+02', '2025-08-19 18:27:42.367407+02', 58, 12);
INSERT INTO public.chat_messages VALUES (173, false, false, 'new-order', '2025-08-19 18:30:12.070353+02', '2025-08-19 18:30:12.070353+02', 59, 14);
INSERT INTO public.chat_messages VALUES (174, false, false, 'accepted-order', '2025-08-19 18:30:21.163495+02', '2025-08-19 18:30:21.163495+02', 59, 12);
INSERT INTO public.chat_messages VALUES (175, false, false, 'renter-payed', '2025-08-19 18:30:38.206621+02', '2025-08-19 18:30:38.206621+02', 59, 14);
INSERT INTO public.chat_messages VALUES (176, false, false, 'waiting-finished-approve', '2025-08-19 18:30:42.77054+02', '2025-08-19 18:30:42.77054+02', 59, 14);
INSERT INTO public.chat_messages VALUES (177, false, false, 'finished', '2025-08-19 18:30:47.94945+02', '2025-08-19 18:30:47.94945+02', 59, 12);
INSERT INTO public.chat_messages VALUES (178, false, false, 'new-order', '2025-08-19 18:31:00.337181+02', '2025-08-19 18:31:00.337181+02', 60, 13);
INSERT INTO public.chat_messages VALUES (179, false, false, 'accepted-order', '2025-08-19 18:31:08.937728+02', '2025-08-19 18:31:08.937728+02', 60, 12);
INSERT INTO public.chat_messages VALUES (180, false, false, 'renter-payed', '2025-08-19 18:31:19.138408+02', '2025-08-19 18:31:19.138408+02', 60, 13);
INSERT INTO public.chat_messages VALUES (181, false, false, 'renter-payed', '2025-08-19 18:31:37.156689+02', '2025-08-19 18:31:37.156689+02', 60, 12);
INSERT INTO public.chat_messages VALUES (182, false, false, 'waiting-finished-approve', '2025-08-19 18:31:42.698756+02', '2025-08-19 18:31:42.698756+02', 60, 13);
INSERT INTO public.chat_messages VALUES (183, false, false, 'finished', '2025-08-19 18:31:47.629424+02', '2025-08-19 18:31:47.629424+02', 60, 12);
INSERT INTO public.chat_messages VALUES (184, false, false, 'new-order', '2025-08-19 18:32:14.480589+02', '2025-08-19 18:32:14.480589+02', 61, 13);
INSERT INTO public.chat_messages VALUES (185, false, false, 'accepted-order', '2025-08-19 18:32:21.995191+02', '2025-08-19 18:32:21.995191+02', 61, 12);
INSERT INTO public.chat_messages VALUES (186, false, false, 'renter-payed', '2025-08-19 18:32:38.572377+02', '2025-08-19 18:32:38.572377+02', 61, 13);
INSERT INTO public.chat_messages VALUES (187, false, false, 'waiting-finished-approve', '2025-08-19 18:32:48.535367+02', '2025-08-19 18:32:48.535367+02', 61, 13);
INSERT INTO public.chat_messages VALUES (188, false, false, 'started-dispute', '2025-08-19 18:33:07.256047+02', '2025-08-19 18:33:07.256047+02', 62, NULL);
INSERT INTO public.chat_messages VALUES (189, false, false, 'started-dispute', '2025-08-19 18:33:07.25809+02', '2025-08-19 18:33:07.25809+02', 63, NULL);
INSERT INTO public.chat_messages VALUES (190, false, false, 'started-dispute', '2025-08-19 18:33:07.259495+02', '2025-08-19 18:33:07.259495+02', 61, 12);
INSERT INTO public.chat_messages VALUES (191, false, false, 'new-order', '2025-08-19 18:33:27.645577+02', '2025-08-19 18:33:27.645577+02', 64, 14);
INSERT INTO public.chat_messages VALUES (192, false, false, 'accepted-order', '2025-08-19 18:33:45.135716+02', '2025-08-19 18:33:45.135716+02', 64, 12);
INSERT INTO public.chat_messages VALUES (193, false, false, 'renter-payed', '2025-08-19 18:34:05.812273+02', '2025-08-19 18:34:05.812273+02', 64, 14);
INSERT INTO public.chat_messages VALUES (194, false, false, 'renter-payed', '2025-08-19 18:34:10.731939+02', '2025-08-19 18:34:10.731939+02', 64, 12);
INSERT INTO public.chat_messages VALUES (195, false, false, 'started-dispute', '2025-08-19 18:34:19.25445+02', '2025-08-19 18:34:19.25445+02', 65, NULL);
INSERT INTO public.chat_messages VALUES (196, false, false, 'started-dispute', '2025-08-19 18:34:19.257392+02', '2025-08-19 18:34:19.257392+02', 66, NULL);
INSERT INTO public.chat_messages VALUES (197, false, false, 'started-dispute', '2025-08-19 18:34:19.259978+02', '2025-08-19 18:34:19.259978+02', 64, 14);
INSERT INTO public.chat_messages VALUES (198, false, false, 'new-order', '2025-08-19 18:34:39.222491+02', '2025-08-19 18:34:39.222491+02', 67, 13);
INSERT INTO public.chat_messages VALUES (199, false, false, 'update-order', '2025-08-19 18:35:02.819635+02', '2025-08-19 18:35:02.819635+02', 67, 12);
INSERT INTO public.chat_messages VALUES (200, false, false, 'update-order', '2025-08-19 18:35:15.575786+02', '2025-08-19 18:35:15.575786+02', 67, 13);
INSERT INTO public.chat_messages VALUES (201, false, false, 'accepted-order', '2025-08-19 18:35:20.736394+02', '2025-08-19 18:35:20.736394+02', 67, 12);
INSERT INTO public.chat_messages VALUES (202, false, false, 'renter-payed', '2025-08-19 18:35:37.845629+02', '2025-08-19 18:35:37.845629+02', 67, 13);
INSERT INTO public.chat_messages VALUES (203, false, false, 'started-dispute', '2025-08-19 18:35:55.162955+02', '2025-08-19 18:35:55.162955+02', 68, NULL);
INSERT INTO public.chat_messages VALUES (204, false, false, 'started-dispute', '2025-08-19 18:35:55.165632+02', '2025-08-19 18:35:55.165632+02', 69, NULL);
INSERT INTO public.chat_messages VALUES (205, false, false, 'started-dispute', '2025-08-19 18:35:55.1682+02', '2025-08-19 18:35:55.1682+02', 67, 12);
INSERT INTO public.chat_messages VALUES (206, false, false, 'new-order', '2025-08-19 18:40:33.006025+02', '2025-08-19 18:40:33.006025+02', 70, 14);
INSERT INTO public.chat_messages VALUES (207, false, false, 'new-order', '2025-08-19 18:40:40.280864+02', '2025-08-19 18:40:40.280864+02', 71, 13);
INSERT INTO public.chat_messages VALUES (208, false, false, 'accepted-order', '2025-08-19 18:40:59.769499+02', '2025-08-19 18:40:59.769499+02', 71, 12);
INSERT INTO public.chat_messages VALUES (209, false, false, 'accepted-order', '2025-08-19 18:41:01.322542+02', '2025-08-19 18:41:01.322542+02', 70, 12);
INSERT INTO public.chat_messages VALUES (210, false, false, 'renter-payed', '2025-08-19 18:41:27.18596+02', '2025-08-19 18:41:27.18596+02', 70, 14);
INSERT INTO public.chat_messages VALUES (211, false, false, 'renter-payed', '2025-08-19 18:41:32.660628+02', '2025-08-19 18:41:32.660628+02', 71, 13);
INSERT INTO public.chat_messages VALUES (212, false, false, 'started-dispute', '2025-08-19 18:41:34.537283+02', '2025-08-19 18:41:34.537283+02', 72, NULL);
INSERT INTO public.chat_messages VALUES (213, false, false, 'started-dispute', '2025-08-19 18:41:34.539363+02', '2025-08-19 18:41:34.539363+02', 73, NULL);
INSERT INTO public.chat_messages VALUES (214, false, false, 'started-dispute', '2025-08-19 18:41:34.542103+02', '2025-08-19 18:41:34.542103+02', 70, 14);
INSERT INTO public.chat_messages VALUES (215, false, false, 'waiting-finished-approve', '2025-08-19 18:41:40.513598+02', '2025-08-19 18:41:40.513598+02', 71, 13);
INSERT INTO public.chat_messages VALUES (216, false, false, 'started-dispute', '2025-08-19 18:41:49.421815+02', '2025-08-19 18:41:49.421815+02', 74, NULL);
INSERT INTO public.chat_messages VALUES (217, false, false, 'started-dispute', '2025-08-19 18:41:49.424358+02', '2025-08-19 18:41:49.424358+02', 75, NULL);
INSERT INTO public.chat_messages VALUES (219, false, false, 'new-order', '2025-08-19 18:42:48.096551+02', '2025-08-19 18:42:48.096551+02', 76, 14);
INSERT INTO public.chat_messages VALUES (218, false, false, 'started-dispute', '2025-08-19 18:41:49.426459+02', '2025-08-19 18:41:49.426459+02', 71, 12);
INSERT INTO public.chat_messages VALUES (235, false, false, 'renter-payed', '2025-08-19 18:44:46.900592+02', '2025-08-19 18:44:46.900592+02', 83, 13);
INSERT INTO public.chat_messages VALUES (236, false, false, 'renter-payed', '2025-08-19 18:44:57.571908+02', '2025-08-19 18:44:57.571908+02', 82, 14);
INSERT INTO public.chat_messages VALUES (237, false, false, 'renter-payed', '2025-08-19 18:45:04.858712+02', '2025-08-19 18:45:04.858712+02', 82, 12);
INSERT INTO public.chat_messages VALUES (238, false, false, 'waiting-finished-approve', '2025-08-19 18:45:26.307356+02', '2025-08-19 18:45:26.307356+02', 82, 14);
INSERT INTO public.chat_messages VALUES (239, false, false, 'started-dispute', '2025-08-19 18:45:32.087785+02', '2025-08-19 18:45:32.087785+02', 84, NULL);
INSERT INTO public.chat_messages VALUES (240, false, false, 'started-dispute', '2025-08-19 18:45:32.090179+02', '2025-08-19 18:45:32.090179+02', 85, NULL);
INSERT INTO public.chat_messages VALUES (241, false, false, 'started-dispute', '2025-08-19 18:45:32.092164+02', '2025-08-19 18:45:32.092164+02', 83, 13);
INSERT INTO public.chat_messages VALUES (242, false, false, 'finished', '2025-08-19 18:45:38.015017+02', '2025-08-19 18:45:38.015017+02', 82, 12);
INSERT INTO public.chat_messages VALUES (220, false, false, 'new-order', '2025-08-19 18:43:03.047241+02', '2025-08-19 18:43:03.047241+02', 77, 13);
INSERT INTO public.chat_messages VALUES (221, false, false, 'accepted-order', '2025-08-19 18:43:08.846928+02', '2025-08-19 18:43:08.846928+02', 77, 12);
INSERT INTO public.chat_messages VALUES (222, false, false, 'accepted-order', '2025-08-19 18:43:10.53661+02', '2025-08-19 18:43:10.53661+02', 76, 12);
INSERT INTO public.chat_messages VALUES (223, false, false, 'renter-payed', '2025-08-19 18:43:32.601295+02', '2025-08-19 18:43:32.601295+02', 77, 13);
INSERT INTO public.chat_messages VALUES (224, false, false, 'started-dispute', '2025-08-19 18:43:38.815161+02', '2025-08-19 18:43:38.815161+02', 78, NULL);
INSERT INTO public.chat_messages VALUES (225, false, false, 'started-dispute', '2025-08-19 18:43:38.817436+02', '2025-08-19 18:43:38.817436+02', 79, NULL);
INSERT INTO public.chat_messages VALUES (226, false, false, 'started-dispute', '2025-08-19 18:43:38.819507+02', '2025-08-19 18:43:38.819507+02', 77, 12);
INSERT INTO public.chat_messages VALUES (227, false, false, 'renter-payed', '2025-08-19 18:43:38.871773+02', '2025-08-19 18:43:38.871773+02', 76, 14);
INSERT INTO public.chat_messages VALUES (228, false, false, 'started-dispute', '2025-08-19 18:43:43.528118+02', '2025-08-19 18:43:43.528118+02', 80, NULL);
INSERT INTO public.chat_messages VALUES (229, false, false, 'started-dispute', '2025-08-19 18:43:43.529673+02', '2025-08-19 18:43:43.529673+02', 81, NULL);
INSERT INTO public.chat_messages VALUES (230, false, false, 'started-dispute', '2025-08-19 18:43:43.531285+02', '2025-08-19 18:43:43.531285+02', 76, 12);
INSERT INTO public.chat_messages VALUES (231, false, false, 'new-order', '2025-08-19 18:44:14.480909+02', '2025-08-19 18:44:14.480909+02', 82, 14);
INSERT INTO public.chat_messages VALUES (232, false, false, 'new-order', '2025-08-19 18:44:20.442731+02', '2025-08-19 18:44:20.442731+02', 83, 13);
INSERT INTO public.chat_messages VALUES (233, false, false, 'accepted-order', '2025-08-19 18:44:26.452467+02', '2025-08-19 18:44:26.452467+02', 83, 12);
INSERT INTO public.chat_messages VALUES (234, false, false, 'accepted-order', '2025-08-19 18:44:28.040219+02', '2025-08-19 18:44:28.040219+02', 82, 12);
INSERT INTO public.chat_messages VALUES (243, false, false, 'new-order', '2025-08-19 19:05:49.96705+02', '2025-08-19 19:05:49.96705+02', 86, 13);
INSERT INTO public.chat_messages VALUES (244, false, false, 'new-order', '2025-08-19 19:06:07.673208+02', '2025-08-19 19:06:07.673208+02', 87, 14);
INSERT INTO public.chat_messages VALUES (245, false, false, 'update-order', '2025-08-19 19:06:27.301955+02', '2025-08-19 19:06:27.301955+02', 86, 12);
INSERT INTO public.chat_messages VALUES (246, false, false, 'update-order', '2025-08-19 19:06:33.047998+02', '2025-08-19 19:06:33.047998+02', 87, 12);
INSERT INTO public.chat_messages VALUES (247, false, false, 'accepted-order', '2025-08-19 19:06:38.597786+02', '2025-08-19 19:06:38.597786+02', 86, 13);
INSERT INTO public.chat_messages VALUES (248, false, false, 'accepted-order', '2025-08-19 19:06:41.298857+02', '2025-08-19 19:06:41.298857+02', 87, 14);
INSERT INTO public.chat_messages VALUES (249, false, false, 'renter-payed', '2025-08-19 19:06:57.33218+02', '2025-08-19 19:06:57.33218+02', 87, 14);
INSERT INTO public.chat_messages VALUES (250, false, false, 'renter-payed', '2025-08-19 19:07:23.073237+02', '2025-08-19 19:07:23.073237+02', 86, 13);
INSERT INTO public.chat_messages VALUES (251, false, false, 'waiting-finished-approve', '2025-08-19 19:07:27.632752+02', '2025-08-19 19:07:27.632752+02', 86, 13);
INSERT INTO public.chat_messages VALUES (252, false, false, 'renter-payed', '2025-08-19 19:07:35.914732+02', '2025-08-19 19:07:35.914732+02', 87, 12);
INSERT INTO public.chat_messages VALUES (253, false, false, 'finished', '2025-08-19 19:07:39.896366+02', '2025-08-19 19:07:39.896366+02', 86, 12);
INSERT INTO public.chat_messages VALUES (254, false, false, 'waiting-finished-approve', '2025-08-19 19:07:56.552205+02', '2025-08-19 19:07:56.552205+02', 87, 14);
INSERT INTO public.chat_messages VALUES (255, false, false, 'finished', '2025-08-19 19:08:01.089768+02', '2025-08-19 19:08:01.089768+02', 87, 12);
INSERT INTO public.chat_messages VALUES (256, false, false, 'new-order', '2025-08-19 19:09:33.92884+02', '2025-08-19 19:09:33.92884+02', 88, 13);
INSERT INTO public.chat_messages VALUES (257, false, false, 'new-order', '2025-08-19 19:09:45.075677+02', '2025-08-19 19:09:45.075677+02', 89, 14);
INSERT INTO public.chat_messages VALUES (258, false, false, 'update-order', '2025-08-19 19:09:54.290951+02', '2025-08-19 19:09:54.290951+02', 89, 12);
INSERT INTO public.chat_messages VALUES (259, false, false, 'update-order', '2025-08-19 19:10:01.774964+02', '2025-08-19 19:10:01.774964+02', 88, 12);
INSERT INTO public.chat_messages VALUES (260, false, false, 'update-order', '2025-08-19 19:10:11.689223+02', '2025-08-19 19:10:11.689223+02', 88, 13);
INSERT INTO public.chat_messages VALUES (261, false, false, 'update-order', '2025-08-19 19:10:24.846006+02', '2025-08-19 19:10:24.846006+02', 89, 14);
INSERT INTO public.chat_messages VALUES (262, false, false, 'accepted-order', '2025-08-19 19:10:30.592827+02', '2025-08-19 19:10:30.592827+02', 89, 12);
INSERT INTO public.chat_messages VALUES (263, false, false, 'accepted-order', '2025-08-19 19:10:32.270824+02', '2025-08-19 19:10:32.270824+02', 88, 12);
INSERT INTO public.chat_messages VALUES (264, false, false, 'renter-payed', '2025-08-19 19:10:56.839855+02', '2025-08-19 19:10:56.839855+02', 89, 14);
INSERT INTO public.chat_messages VALUES (265, false, false, 'renter-payed', '2025-08-19 19:11:05.525263+02', '2025-08-19 19:11:05.525263+02', 88, 13);
INSERT INTO public.chat_messages VALUES (266, false, false, 'renter-payed', '2025-08-19 19:11:28.422045+02', '2025-08-19 19:11:28.422045+02', 88, 12);
INSERT INTO public.chat_messages VALUES (267, false, false, 'waiting-finished-approve', '2025-08-19 19:12:17.987747+02', '2025-08-19 19:12:17.987747+02', 88, 13);
INSERT INTO public.chat_messages VALUES (268, false, false, 'waiting-finished-approve', '2025-08-19 19:12:21.60732+02', '2025-08-19 19:12:21.60732+02', 89, 14);
INSERT INTO public.chat_messages VALUES (269, false, false, 'finished', '2025-08-19 19:12:24.584605+02', '2025-08-19 19:12:24.584605+02', 89, 12);
INSERT INTO public.chat_messages VALUES (270, false, false, 'finished', '2025-08-19 19:12:26.510996+02', '2025-08-19 19:12:26.510996+02', 88, 12);
INSERT INTO public.chat_messages VALUES (271, false, false, 'new-order', '2025-08-19 19:15:36.93588+02', '2025-08-19 19:15:36.93588+02', 90, 13);
INSERT INTO public.chat_messages VALUES (272, false, false, 'new-order', '2025-08-19 19:16:27.640832+02', '2025-08-19 19:16:27.640832+02', 91, 14);
INSERT INTO public.chat_messages VALUES (273, false, false, 'accepted-order', '2025-08-19 19:16:35.178806+02', '2025-08-19 19:16:35.178806+02', 91, 10);
INSERT INTO public.chat_messages VALUES (274, false, false, 'update-order', '2025-08-19 19:16:39.393324+02', '2025-08-19 19:16:39.393324+02', 90, 10);
INSERT INTO public.chat_messages VALUES (275, false, false, 'accepted-order', '2025-08-19 19:16:42.79703+02', '2025-08-19 19:16:42.79703+02', 90, 13);
INSERT INTO public.chat_messages VALUES (276, false, false, 'renter-payed', '2025-08-19 19:16:57.677352+02', '2025-08-19 19:16:57.677352+02', 90, 13);
INSERT INTO public.chat_messages VALUES (277, false, false, 'started-dispute', '2025-08-19 19:17:07.719656+02', '2025-08-19 19:17:07.719656+02', 92, NULL);
INSERT INTO public.chat_messages VALUES (278, false, false, 'started-dispute', '2025-08-19 19:17:07.722591+02', '2025-08-19 19:17:07.722591+02', 93, NULL);
INSERT INTO public.chat_messages VALUES (279, false, false, 'started-dispute', '2025-08-19 19:17:07.725194+02', '2025-08-19 19:17:07.725194+02', 90, 13);
INSERT INTO public.chat_messages VALUES (280, false, false, 'renter-payed', '2025-08-19 19:17:18.417174+02', '2025-08-19 19:17:18.417174+02', 91, 14);
INSERT INTO public.chat_messages VALUES (281, false, false, 'renter-payed', '2025-08-19 19:17:53.764202+02', '2025-08-19 19:17:53.764202+02', 91, 10);
INSERT INTO public.chat_messages VALUES (282, false, false, 'started-dispute', '2025-08-19 19:18:02.554983+02', '2025-08-19 19:18:02.554983+02', 94, NULL);
INSERT INTO public.chat_messages VALUES (283, false, false, 'started-dispute', '2025-08-19 19:18:02.558097+02', '2025-08-19 19:18:02.558097+02', 95, NULL);
INSERT INTO public.chat_messages VALUES (284, false, false, 'started-dispute', '2025-08-19 19:18:02.559651+02', '2025-08-19 19:18:02.559651+02', 91, 10);
INSERT INTO public.chat_messages VALUES (285, false, false, 'new-order', '2025-08-19 19:18:57.055233+02', '2025-08-19 19:18:57.055233+02', 96, 14);
INSERT INTO public.chat_messages VALUES (286, false, false, 'update-order', '2025-08-19 19:19:09.006456+02', '2025-08-19 19:19:09.006456+02', 96, 10);
INSERT INTO public.chat_messages VALUES (287, false, false, 'update-order', '2025-08-19 19:19:22.941813+02', '2025-08-19 19:19:22.941813+02', 96, 14);
INSERT INTO public.chat_messages VALUES (288, false, false, 'update-order', '2025-08-19 19:19:32.293102+02', '2025-08-19 19:19:32.293102+02', 96, 10);
INSERT INTO public.chat_messages VALUES (289, false, false, 'accepted-order', '2025-08-19 19:19:37.751614+02', '2025-08-19 19:19:37.751614+02', 96, 14);
INSERT INTO public.chat_messages VALUES (290, false, false, 'renter-payed', '2025-08-19 19:19:51.259523+02', '2025-08-19 19:19:51.259523+02', 96, 14);
INSERT INTO public.chat_messages VALUES (291, false, false, 'waiting-finished-approve', '2025-08-19 19:19:55.194011+02', '2025-08-19 19:19:55.194011+02', 96, 14);
INSERT INTO public.chat_messages VALUES (292, false, false, 'started-dispute', '2025-08-19 19:20:01.366567+02', '2025-08-19 19:20:01.366567+02', 97, NULL);
INSERT INTO public.chat_messages VALUES (293, false, false, 'started-dispute', '2025-08-19 19:20:01.369852+02', '2025-08-19 19:20:01.369852+02', 98, NULL);
INSERT INTO public.chat_messages VALUES (294, false, false, 'started-dispute', '2025-08-19 19:20:01.371465+02', '2025-08-19 19:20:01.371465+02', 96, 10);
INSERT INTO public.chat_messages VALUES (295, false, false, 'new-order', '2025-08-19 19:20:56.625556+02', '2025-08-19 19:20:56.625556+02', 99, 14);
INSERT INTO public.chat_messages VALUES (296, false, false, 'accepted-order', '2025-08-19 19:21:02.650798+02', '2025-08-19 19:21:02.650798+02', 99, 10);
INSERT INTO public.chat_messages VALUES (297, false, false, 'renter-payed', '2025-08-19 19:21:11.232143+02', '2025-08-19 19:21:11.232143+02', 99, 14);
INSERT INTO public.chat_messages VALUES (298, false, false, 'renter-payed', '2025-08-19 19:21:19.055348+02', '2025-08-19 19:21:19.055348+02', 99, 10);
INSERT INTO public.chat_messages VALUES (299, false, false, 'waiting-finished-approve', '2025-08-19 19:21:23.539539+02', '2025-08-19 19:21:23.539539+02', 99, 14);
INSERT INTO public.chat_messages VALUES (300, false, false, 'finished', '2025-08-19 19:21:28.393204+02', '2025-08-19 19:21:28.393204+02', 99, 10);
INSERT INTO public.chat_messages VALUES (301, false, false, 'new-order', '2025-08-19 19:30:22.678591+02', '2025-08-19 19:30:22.678591+02', 100, 13);
INSERT INTO public.chat_messages VALUES (302, false, false, 'new-order', '2025-08-19 19:30:32.076481+02', '2025-08-19 19:30:32.076481+02', 101, 14);
INSERT INTO public.chat_messages VALUES (303, false, false, 'update-order', '2025-08-19 19:30:43.564328+02', '2025-08-19 19:30:43.564328+02', 101, 6);
INSERT INTO public.chat_messages VALUES (304, false, false, 'update-order', '2025-08-19 19:30:49.075566+02', '2025-08-19 19:30:49.075566+02', 100, 6);
INSERT INTO public.chat_messages VALUES (305, false, false, 'update-order', '2025-08-19 19:30:59.672381+02', '2025-08-19 19:30:59.672381+02', 100, 13);
INSERT INTO public.chat_messages VALUES (306, false, false, 'update-order', '2025-08-19 19:31:09.843903+02', '2025-08-19 19:31:09.843903+02', 101, 14);
INSERT INTO public.chat_messages VALUES (307, false, false, 'accepted-order', '2025-08-19 19:31:15.480693+02', '2025-08-19 19:31:15.480693+02', 101, 6);
INSERT INTO public.chat_messages VALUES (308, false, false, 'accepted-order', '2025-08-19 19:31:16.887738+02', '2025-08-19 19:31:16.887738+02', 100, 6);
INSERT INTO public.chat_messages VALUES (309, false, false, 'renter-payed', '2025-08-19 19:31:35.185939+02', '2025-08-19 19:31:35.185939+02', 101, 14);
INSERT INTO public.chat_messages VALUES (310, false, false, 'renter-payed', '2025-08-19 19:31:55.90496+02', '2025-08-19 19:31:55.90496+02', 100, 13);
INSERT INTO public.chat_messages VALUES (311, false, false, 'started-dispute', '2025-08-19 19:32:05.441506+02', '2025-08-19 19:32:05.441506+02', 102, NULL);
INSERT INTO public.chat_messages VALUES (312, false, false, 'started-dispute', '2025-08-19 19:32:05.443523+02', '2025-08-19 19:32:05.443523+02', 103, NULL);
INSERT INTO public.chat_messages VALUES (313, false, false, 'started-dispute', '2025-08-19 19:32:05.446009+02', '2025-08-19 19:32:05.446009+02', 100, 6);
INSERT INTO public.chat_messages VALUES (314, false, false, 'renter-payed', '2025-08-19 19:32:10.249459+02', '2025-08-19 19:32:10.249459+02', 101, 6);
INSERT INTO public.chat_messages VALUES (315, false, false, 'waiting-finished-approve', '2025-08-19 19:32:14.127453+02', '2025-08-19 19:32:14.127453+02', 101, 14);
INSERT INTO public.chat_messages VALUES (316, false, false, 'finished', '2025-08-19 19:32:35.090269+02', '2025-08-19 19:32:35.090269+02', 101, 6);
INSERT INTO public.chat_messages VALUES (317, false, false, 'new-order', '2025-08-19 19:32:49.562407+02', '2025-08-19 19:32:49.562407+02', 104, 13);
INSERT INTO public.chat_messages VALUES (318, false, false, 'new-order', '2025-08-19 19:33:00.70671+02', '2025-08-19 19:33:00.70671+02', 105, 14);
INSERT INTO public.chat_messages VALUES (319, false, false, 'accepted-order', '2025-08-19 19:33:08.887321+02', '2025-08-19 19:33:08.887321+02', 105, 6);
INSERT INTO public.chat_messages VALUES (320, false, false, 'accepted-order', '2025-08-19 19:33:10.075494+02', '2025-08-19 19:33:10.075494+02', 104, 6);
INSERT INTO public.chat_messages VALUES (321, false, false, 'renter-payed', '2025-08-19 19:33:30.717714+02', '2025-08-19 19:33:30.717714+02', 105, 14);
INSERT INTO public.chat_messages VALUES (322, false, false, 'renter-payed', '2025-08-19 19:33:31.014277+02', '2025-08-19 19:33:31.014277+02', 104, 13);
INSERT INTO public.chat_messages VALUES (323, false, false, 'waiting-finished-approve', '2025-08-19 19:33:37.445888+02', '2025-08-19 19:33:37.445888+02', 105, 14);
INSERT INTO public.chat_messages VALUES (324, false, false, 'started-dispute', '2025-08-19 19:33:47.942779+02', '2025-08-19 19:33:47.942779+02', 106, NULL);
INSERT INTO public.chat_messages VALUES (325, false, false, 'started-dispute', '2025-08-19 19:33:47.945866+02', '2025-08-19 19:33:47.945866+02', 107, NULL);
INSERT INTO public.chat_messages VALUES (326, false, false, 'started-dispute', '2025-08-19 19:33:47.947671+02', '2025-08-19 19:33:47.947671+02', 105, 6);
INSERT INTO public.chat_messages VALUES (327, false, false, 'renter-payed', '2025-08-19 19:33:58.603774+02', '2025-08-19 19:33:58.603774+02', 104, 6);
INSERT INTO public.chat_messages VALUES (328, false, false, 'waiting-finished-approve', '2025-08-19 19:34:02.019638+02', '2025-08-19 19:34:02.019638+02', 104, 13);
INSERT INTO public.chat_messages VALUES (329, false, false, 'finished', '2025-08-19 19:34:06.962457+02', '2025-08-19 19:34:06.962457+02', 104, 6);
INSERT INTO public.chat_messages VALUES (330, false, false, 'new-order', '2025-08-19 19:38:06.535424+02', '2025-08-19 19:38:06.535424+02', 108, 13);
INSERT INTO public.chat_messages VALUES (331, false, false, 'new-order', '2025-08-19 19:38:19.502984+02', '2025-08-19 19:38:19.502984+02', 109, 1);
INSERT INTO public.chat_messages VALUES (332, false, false, 'accepted-order', '2025-08-19 19:38:22.994908+02', '2025-08-19 19:38:22.994908+02', 109, 6);
INSERT INTO public.chat_messages VALUES (333, false, false, 'accepted-order', '2025-08-19 19:38:24.561067+02', '2025-08-19 19:38:24.561067+02', 108, 6);
INSERT INTO public.chat_messages VALUES (334, false, false, 'renter-payed', '2025-08-19 19:39:29.44008+02', '2025-08-19 19:39:29.44008+02', 108, 13);
INSERT INTO public.chat_messages VALUES (335, false, false, 'renter-payed', '2025-08-19 19:39:48.05369+02', '2025-08-19 19:39:48.05369+02', 109, 1);
INSERT INTO public.chat_messages VALUES (336, false, false, 'renter-payed', '2025-08-19 19:39:55.578784+02', '2025-08-19 19:39:55.578784+02', 109, 6);
INSERT INTO public.chat_messages VALUES (337, false, false, 'waiting-finished-approve', '2025-08-19 19:40:00.668171+02', '2025-08-19 19:40:00.668171+02', 109, 1);
INSERT INTO public.chat_messages VALUES (338, false, false, 'finished', '2025-08-19 19:40:05.091738+02', '2025-08-19 19:40:05.091738+02', 109, 6);
INSERT INTO public.chat_messages VALUES (339, false, false, 'started-dispute', '2025-08-19 19:40:10.860513+02', '2025-08-19 19:40:10.860513+02', 110, NULL);
INSERT INTO public.chat_messages VALUES (340, false, false, 'started-dispute', '2025-08-19 19:40:10.86313+02', '2025-08-19 19:40:10.86313+02', 111, NULL);
INSERT INTO public.chat_messages VALUES (341, false, false, 'started-dispute', '2025-08-19 19:40:10.866474+02', '2025-08-19 19:40:10.866474+02', 108, 6);


--
-- TOC entry 5221 (class 0 OID 962437)
-- Dependencies: 270
-- Data for Name: chat_messages_contents; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.chat_messages_contents VALUES (1, '{"listingName":"Men''s low-top sneakers Puma Rebound v6 Low 39232843 44","offerPrice":10,"listingPhotoType":"storage","listingPhotoPath":"listings/4dc3e136a36760f831bf.png","offerStartDate":"2025-08-10 00:00","offerFinishDate":"2025-08-14 00:00","description":"Hi, I want to rent sneakers to show off in front of a girl :)"}', '2025-08-10 12:44:29.653034+02', '2025-08-10 12:44:29.653034+02', 1);
INSERT INTO public.chat_messages_contents VALUES (2, '{"listingName":"Leggings","offerPrice":5.74,"listingPhotoType":"storage","listingPhotoPath":"listings/aa464e5af99479fc3c68.jpeg","offerStartDate":"2025-08-18 00:00","offerFinishDate":"2025-08-23 00:00","description":"Hi, I want to try going to training, so I only need these leggings for a week"}', '2025-08-18 17:31:01.472965+02', '2025-08-18 17:31:01.472965+02', 2);
INSERT INTO public.chat_messages_contents VALUES (3, '{"text":"ok"}', '2025-08-18 17:35:54.206184+02', '2025-08-18 17:35:54.206184+02', 3);
INSERT INTO public.chat_messages_contents VALUES (4, '{}', '2025-08-18 17:58:46.195724+02', '2025-08-18 17:58:46.195724+02', 4);
INSERT INTO public.chat_messages_contents VALUES (5, '{}', '2025-08-18 18:10:12.058116+02', '2025-08-18 18:10:12.058116+02', 5);
INSERT INTO public.chat_messages_contents VALUES (6, '{"listingName":"Footwear","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/1c10013db90d0d73e46e.jpeg","offerStartDate":"2025-08-18 00:00","offerFinishDate":"2025-08-23 00:00","description":"Footwear rental needed for 7 days. Kindly confirm availability and cost."}', '2025-08-18 18:28:45.520918+02', '2025-08-18 18:28:45.520918+02', 6);
INSERT INTO public.chat_messages_contents VALUES (7, '{}', '2025-08-18 18:28:59.67777+02', '2025-08-18 18:28:59.67777+02', 7);
INSERT INTO public.chat_messages_contents VALUES (8, '{}', '2025-08-18 18:31:05.577352+02', '2025-08-18 18:31:05.577352+02', 8);
INSERT INTO public.chat_messages_contents VALUES (9, '{}', '2025-08-18 18:31:22.111668+02', '2025-08-18 18:31:22.111668+02', 9);
INSERT INTO public.chat_messages_contents VALUES (10, '{"text":"realy finished?"}', '2025-08-18 18:31:40.864012+02', '2025-08-18 18:31:40.864012+02', 10);
INSERT INTO public.chat_messages_contents VALUES (11, '{"text":"yes"}', '2025-08-18 18:31:47.036874+02', '2025-08-18 18:31:47.036874+02', 11);
INSERT INTO public.chat_messages_contents VALUES (12, '{}', '2025-08-18 18:31:54.169538+02', '2025-08-18 18:31:54.169538+02', 12);
INSERT INTO public.chat_messages_contents VALUES (13, '{"itemDescriptionAccuracy":2,"photoAccuracy":5,"pickupCondition":1,"cleanliness":2,"responsiveness":3,"clarity":4,"schedulingFlexibility":2,"issueResolution":3,"leaveFeedback":"cool","description":"cool"}', '2025-08-18 18:32:13.605157+02', '2025-08-18 18:32:13.605157+02', 13);
INSERT INTO public.chat_messages_contents VALUES (14, '{"care":2,"timeliness":5,"responsiveness":5,"clarity":5,"usageGuidelines":5,"termsOfService":3,"honesty":3,"reliability":5,"satisfaction":5,"leaveFeedback":"cool","description":"cool"}', '2025-08-18 18:33:15.327105+02', '2025-08-18 18:33:15.327105+02', 14);
INSERT INTO public.chat_messages_contents VALUES (15, '{"listingName":"Footwear","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/1c10013db90d0d73e46e.jpeg","offerStartDate":"2025-08-24 00:00","offerFinishDate":"2025-08-25 00:00","description":"coool, i need it"}', '2025-08-18 18:36:30.019996+02', '2025-08-18 18:36:30.019996+02', 15);
INSERT INTO public.chat_messages_contents VALUES (16, '{}', '2025-08-18 18:36:43.302464+02', '2025-08-18 18:36:43.302464+02', 16);
INSERT INTO public.chat_messages_contents VALUES (17, '{}', '2025-08-18 18:37:06.49832+02', '2025-08-18 18:37:06.49832+02', 17);
INSERT INTO public.chat_messages_contents VALUES (18, '{"description":"bad attitude","type":"communication","senderName":"Hannah Ibarra","senderId":4}', '2025-08-18 18:37:30.16767+02', '2025-08-18 18:37:30.16767+02', 18);
INSERT INTO public.chat_messages_contents VALUES (19, '{"description":"bad attitude","type":"communication","senderName":"Hannah Ibarra","senderId":4}', '2025-08-18 18:37:30.17473+02', '2025-08-18 18:37:30.17473+02', 19);
INSERT INTO public.chat_messages_contents VALUES (20, '{"description":"bad attitude","type":"communication"}', '2025-08-18 18:37:30.18582+02', '2025-08-18 18:37:30.18582+02', 20);
INSERT INTO public.chat_messages_contents VALUES (21, '{"listingName":"Bracelet","offerPrice":5.2,"listingPhotoType":"storage","listingPhotoPath":"listings/05ad4436955019b09a51.jpeg","offerStartDate":"2025-08-18 00:00","offerFinishDate":"2025-09-06 00:00","description":"Request to rent jewelry for one week. Please confirm availability and price"}', '2025-08-18 18:39:23.358648+02', '2025-08-18 18:39:23.358648+02', 21);
INSERT INTO public.chat_messages_contents VALUES (22, '{"requestId":1,"listingName":"Bracelet","offerPrice":5.2,"listingPhotoPath":"listings/05ad4436955019b09a51.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-18 00:00","offerStartDate":"2025-08-19 00:00"}', '2025-08-18 18:39:35.766086+02', '2025-08-18 18:39:35.766086+02', 22);
INSERT INTO public.chat_messages_contents VALUES (23, '{}', '2025-08-18 18:39:41.389405+02', '2025-08-18 18:39:41.389405+02', 23);
INSERT INTO public.chat_messages_contents VALUES (24, '{}', '2025-08-18 18:39:54.547627+02', '2025-08-18 18:39:54.547627+02', 24);
INSERT INTO public.chat_messages_contents VALUES (25, '{}', '2025-08-18 18:40:03.212868+02', '2025-08-18 18:40:03.212868+02', 25);
INSERT INTO public.chat_messages_contents VALUES (26, '{"description":"changed the decoration","type":"damage","senderName":"Holly Burgess","senderId":3}', '2025-08-18 18:40:26.429265+02', '2025-08-18 18:40:26.429265+02', 26);
INSERT INTO public.chat_messages_contents VALUES (27, '{"description":"changed the decoration","type":"damage","senderName":"Holly Burgess","senderId":3}', '2025-08-18 18:40:26.436108+02', '2025-08-18 18:40:26.436108+02', 27);
INSERT INTO public.chat_messages_contents VALUES (28, '{"description":"changed the decoration","type":"damage"}', '2025-08-18 18:40:26.443059+02', '2025-08-18 18:40:26.443059+02', 28);
INSERT INTO public.chat_messages_contents VALUES (29, '{"listingName":"Sweater","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/80f2ac56a3f579d1b881.jpeg","offerStartDate":"2025-08-18 00:00","offerFinishDate":"2025-08-18 00:00","description":"Hi, I’d like to rent a sweater for a celebration. Could you please let me know the availability and rental terms?"}', '2025-08-18 18:43:31.117448+02', '2025-08-18 18:43:31.117448+02', 29);
INSERT INTO public.chat_messages_contents VALUES (30, '{"text":"yes, you are welcome"}', '2025-08-18 18:44:21.670393+02', '2025-08-18 18:44:21.670393+02', 30);
INSERT INTO public.chat_messages_contents VALUES (31, '{}', '2025-08-18 18:44:22.973776+02', '2025-08-18 18:44:22.973776+02', 31);
INSERT INTO public.chat_messages_contents VALUES (32, '{}', '2025-08-18 18:48:55.562832+02', '2025-08-18 18:48:55.562832+02', 32);
INSERT INTO public.chat_messages_contents VALUES (33, '{}', '2025-08-18 18:49:04.79452+02', '2025-08-18 18:49:04.79452+02', 33);
INSERT INTO public.chat_messages_contents VALUES (34, '{}', '2025-08-18 18:53:05.618567+02', '2025-08-18 18:53:05.618567+02', 34);
INSERT INTO public.chat_messages_contents VALUES (35, '{"care":2,"timeliness":4,"responsiveness":2,"clarity":1,"usageGuidelines":4,"termsOfService":5,"honesty":1,"reliability":2,"satisfaction":4,"leaveFeedback":"amazing!","description":"amazing!"}', '2025-08-18 18:53:23.557741+02', '2025-08-18 18:53:23.557741+02', 35);
INSERT INTO public.chat_messages_contents VALUES (36, '{"listingName":"Ring","offerPrice":6.06,"listingPhotoType":"storage","listingPhotoPath":"listings/e111a05c272704030bc2.jpeg","offerStartDate":"2025-08-18 00:00","offerFinishDate":"2025-08-30 00:00","description":"amazing!"}', '2025-08-18 18:53:53.26879+02', '2025-08-18 18:53:53.26879+02', 36);
INSERT INTO public.chat_messages_contents VALUES (37, '{"requestId":2,"listingName":"Ring","offerPrice":6.06,"listingPhotoPath":"listings/e111a05c272704030bc2.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-31 00:00","offerStartDate":"2025-09-05 00:00"}', '2025-08-18 18:54:14.982192+02', '2025-08-18 18:54:14.982192+02', 37);
INSERT INTO public.chat_messages_contents VALUES (38, '{}', '2025-08-18 18:54:23.872987+02', '2025-08-18 18:54:23.872987+02', 38);
INSERT INTO public.chat_messages_contents VALUES (39, '{}', '2025-08-18 18:55:30.139447+02', '2025-08-18 18:55:30.139447+02', 39);
INSERT INTO public.chat_messages_contents VALUES (40, '{}', '2025-08-18 18:56:09.577702+02', '2025-08-18 18:56:09.577702+02', 40);
INSERT INTO public.chat_messages_contents VALUES (41, '{"description":"bad","type":"problems-with-withdrawal","senderName":"Carrie Thomas","senderId":6}', '2025-08-18 18:56:54.169696+02', '2025-08-18 18:56:54.169696+02', 41);
INSERT INTO public.chat_messages_contents VALUES (42, '{"description":"bad","type":"problems-with-withdrawal","senderName":"Carrie Thomas","senderId":6}', '2025-08-18 18:56:54.175441+02', '2025-08-18 18:56:54.175441+02', 42);
INSERT INTO public.chat_messages_contents VALUES (43, '{"description":"bad","type":"problems-with-withdrawal"}', '2025-08-18 18:56:54.183892+02', '2025-08-18 18:56:54.183892+02', 43);
INSERT INTO public.chat_messages_contents VALUES (44, '{"listingName":"Tracksuit","offerPrice":6.12,"listingPhotoType":"storage","listingPhotoPath":"listings/0db95132e9e2c6d5e6ad.jpeg","offerStartDate":"2025-08-31 00:00","offerFinishDate":"2025-09-06 00:00","description":"hi, please approve"}', '2025-08-18 19:06:52.848187+02', '2025-08-18 19:06:52.848187+02', 44);
INSERT INTO public.chat_messages_contents VALUES (45, '{}', '2025-08-18 19:07:06.843494+02', '2025-08-18 19:07:06.843494+02', 45);
INSERT INTO public.chat_messages_contents VALUES (46, '{}', '2025-08-18 19:08:10.721973+02', '2025-08-18 19:08:10.721973+02', 46);
INSERT INTO public.chat_messages_contents VALUES (47, '{}', '2025-08-18 19:08:15.02039+02', '2025-08-18 19:08:15.02039+02', 47);
INSERT INTO public.chat_messages_contents VALUES (48, '{}', '2025-08-18 19:08:22.275247+02', '2025-08-18 19:08:22.275247+02', 48);
INSERT INTO public.chat_messages_contents VALUES (49, '{"listingName":"Tracksuit","offerPrice":6.12,"listingPhotoType":"storage","listingPhotoPath":"listings/0db95132e9e2c6d5e6ad.jpeg","offerStartDate":"2025-08-18 20:08","offerFinishDate":"2025-08-18 20:08","description":"need more"}', '2025-08-18 19:08:47.609821+02', '2025-08-18 19:08:47.609821+02', 49);
INSERT INTO public.chat_messages_contents VALUES (50, '{"requestId":3,"listingName":"Tracksuit","offerPrice":6.12,"listingPhotoPath":"listings/0db95132e9e2c6d5e6ad.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-29 00:00","offerStartDate":"2025-08-29 00:00"}', '2025-08-18 19:09:02.078109+02', '2025-08-18 19:09:02.078109+02', 50);
INSERT INTO public.chat_messages_contents VALUES (51, '{"requestId":4,"listingName":"Tracksuit","offerPrice":6.12,"listingPhotoPath":"listings/0db95132e9e2c6d5e6ad.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-30 00:00","offerStartDate":"2025-08-30 00:00"}', '2025-08-18 19:09:18.148503+02', '2025-08-18 19:09:18.148503+02', 51);
INSERT INTO public.chat_messages_contents VALUES (52, '{}', '2025-08-18 19:09:24.912172+02', '2025-08-18 19:09:24.912172+02', 52);
INSERT INTO public.chat_messages_contents VALUES (53, '{}', '2025-08-18 19:09:51.877159+02', '2025-08-18 19:09:51.877159+02', 53);
INSERT INTO public.chat_messages_contents VALUES (54, '{"description":"???","type":"payment","senderName":"Hannah Ibarra","senderId":4}', '2025-08-18 19:10:04.729233+02', '2025-08-18 19:10:04.729233+02', 54);
INSERT INTO public.chat_messages_contents VALUES (242, '{}', '2025-08-19 18:45:38.016036+02', '2025-08-19 18:45:38.016036+02', 242);
INSERT INTO public.chat_messages_contents VALUES (55, '{"description":"???","type":"payment","senderName":"Hannah Ibarra","senderId":4}', '2025-08-18 19:10:04.735571+02', '2025-08-18 19:10:04.735571+02', 55);
INSERT INTO public.chat_messages_contents VALUES (56, '{"description":"???","type":"payment"}', '2025-08-18 19:10:04.74699+02', '2025-08-18 19:10:04.74699+02', 56);
INSERT INTO public.chat_messages_contents VALUES (57, '{"listingName":"Bracelet","offerPrice":5.2,"listingPhotoType":"storage","listingPhotoPath":"listings/05ad4436955019b09a51.jpeg","offerStartDate":"2025-08-18 00:00","offerFinishDate":"2025-08-30 00:00","description":"test"}', '2025-08-18 19:11:21.054893+02', '2025-08-18 19:11:21.054893+02', 57);
INSERT INTO public.chat_messages_contents VALUES (58, '{}', '2025-08-18 19:12:05.267324+02', '2025-08-18 19:12:05.267324+02', 58);
INSERT INTO public.chat_messages_contents VALUES (59, '{}', '2025-08-18 19:12:21.768963+02', '2025-08-18 19:12:21.768963+02', 59);
INSERT INTO public.chat_messages_contents VALUES (60, '{}', '2025-08-18 19:12:25.935342+02', '2025-08-18 19:12:25.935342+02', 60);
INSERT INTO public.chat_messages_contents VALUES (61, '{"description":"incorrect information","type":"payment","senderName":"Holly Burgess","senderId":3}', '2025-08-18 19:12:52.437744+02', '2025-08-18 19:12:52.437744+02', 61);
INSERT INTO public.chat_messages_contents VALUES (62, '{"description":"incorrect information","type":"payment","senderName":"Holly Burgess","senderId":3}', '2025-08-18 19:12:52.44506+02', '2025-08-18 19:12:52.44506+02', 62);
INSERT INTO public.chat_messages_contents VALUES (63, '{"description":"incorrect information","type":"payment"}', '2025-08-18 19:12:52.452994+02', '2025-08-18 19:12:52.452994+02', 63);
INSERT INTO public.chat_messages_contents VALUES (64, '{"listingName":"Handbag","offerPrice":9.76,"listingPhotoType":"storage","listingPhotoPath":"listings/60db68cf451a03bfeac7.jpeg","offerStartDate":"2025-08-18 00:00","offerFinishDate":"2025-08-18 00:00","description":"incorrect information"}', '2025-08-18 19:13:42.44512+02', '2025-08-18 19:13:42.44512+02', 64);
INSERT INTO public.chat_messages_contents VALUES (65, '{}', '2025-08-18 19:13:51.044446+02', '2025-08-18 19:13:51.044446+02', 65);
INSERT INTO public.chat_messages_contents VALUES (66, '{}', '2025-08-18 19:14:03.992023+02', '2025-08-18 19:14:03.992023+02', 66);
INSERT INTO public.chat_messages_contents VALUES (67, '{}', '2025-08-18 19:14:15.061595+02', '2025-08-18 19:14:15.061595+02', 67);
INSERT INTO public.chat_messages_contents VALUES (68, '{}', '2025-08-18 19:14:22.340171+02', '2025-08-18 19:14:22.340171+02', 68);
INSERT INTO public.chat_messages_contents VALUES (69, '{"description":"????","type":"others","senderName":"Hannah Ibarra","senderId":4}', '2025-08-18 19:14:31.477379+02', '2025-08-18 19:14:31.477379+02', 69);
INSERT INTO public.chat_messages_contents VALUES (70, '{"description":"????","type":"others","senderName":"Hannah Ibarra","senderId":4}', '2025-08-18 19:14:31.482604+02', '2025-08-18 19:14:31.482604+02', 70);
INSERT INTO public.chat_messages_contents VALUES (71, '{"description":"????","type":"others"}', '2025-08-18 19:14:31.490137+02', '2025-08-18 19:14:31.490137+02', 71);
INSERT INTO public.chat_messages_contents VALUES (72, '{"listingName":"Bracelet","offerPrice":5.2,"listingPhotoType":"storage","listingPhotoPath":"listings/05ad4436955019b09a51.jpeg","offerStartDate":"2025-08-31 00:00","offerFinishDate":"2025-08-31 00:00","description":"test"}', '2025-08-18 19:14:52.510802+02', '2025-08-18 19:14:52.510802+02', 72);
INSERT INTO public.chat_messages_contents VALUES (73, '{"requestId":5,"listingName":"Bracelet","offerPrice":5.2,"listingPhotoPath":"listings/05ad4436955019b09a51.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-09-05 00:00","offerStartDate":"2025-09-06 00:00"}', '2025-08-18 19:15:39.59672+02', '2025-08-18 19:15:39.59672+02', 73);
INSERT INTO public.chat_messages_contents VALUES (74, '{"requestId":6,"listingName":"Bracelet","offerPrice":5.2,"listingPhotoPath":"listings/05ad4436955019b09a51.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-09-06 00:00","offerStartDate":"2025-09-06 00:00"}', '2025-08-18 19:15:54.000532+02', '2025-08-18 19:15:54.000532+02', 74);
INSERT INTO public.chat_messages_contents VALUES (75, '{}', '2025-08-18 19:16:00.468571+02', '2025-08-18 19:16:00.468571+02', 75);
INSERT INTO public.chat_messages_contents VALUES (76, '{}', '2025-08-18 19:16:12.178098+02', '2025-08-18 19:16:12.178098+02', 76);
INSERT INTO public.chat_messages_contents VALUES (77, '{}', '2025-08-18 19:17:17.803386+02', '2025-08-18 19:17:17.803386+02', 77);
INSERT INTO public.chat_messages_contents VALUES (78, '{"description":"???","type":"damage","senderName":"Holly Burgess","senderId":3}', '2025-08-18 19:17:28.595356+02', '2025-08-18 19:17:28.595356+02', 78);
INSERT INTO public.chat_messages_contents VALUES (79, '{"description":"???","type":"damage","senderName":"Holly Burgess","senderId":3}', '2025-08-18 19:17:28.601306+02', '2025-08-18 19:17:28.601306+02', 79);
INSERT INTO public.chat_messages_contents VALUES (80, '{"description":"???","type":"damage"}', '2025-08-18 19:17:28.611715+02', '2025-08-18 19:17:28.611715+02', 80);
INSERT INTO public.chat_messages_contents VALUES (81, '{"listingName":"Bracelet","offerPrice":5.2,"listingPhotoType":"storage","listingPhotoPath":"listings/05ad4436955019b09a51.jpeg","offerStartDate":"2025-09-18 00:00","offerFinishDate":"2025-09-18 00:00","description":"123"}', '2025-08-18 19:26:31.749961+02', '2025-08-18 19:26:31.749961+02', 81);
INSERT INTO public.chat_messages_contents VALUES (82, '{}', '2025-08-18 19:26:41.53931+02', '2025-08-18 19:26:41.53931+02', 82);
INSERT INTO public.chat_messages_contents VALUES (83, '{}', '2025-08-18 19:27:07.297612+02', '2025-08-18 19:27:07.297612+02', 83);
INSERT INTO public.chat_messages_contents VALUES (84, '{}', '2025-08-18 19:27:16.579769+02', '2025-08-18 19:27:16.579769+02', 84);
INSERT INTO public.chat_messages_contents VALUES (85, '{"description":"false","type":"damage","senderName":"Holly Burgess","senderId":3}', '2025-08-18 19:27:29.622446+02', '2025-08-18 19:27:29.622446+02', 85);
INSERT INTO public.chat_messages_contents VALUES (86, '{"description":"false","type":"damage","senderName":"Holly Burgess","senderId":3}', '2025-08-18 19:27:29.628518+02', '2025-08-18 19:27:29.628518+02', 86);
INSERT INTO public.chat_messages_contents VALUES (87, '{"description":"false","type":"damage"}', '2025-08-18 19:27:29.6361+02', '2025-08-18 19:27:29.6361+02', 87);
INSERT INTO public.chat_messages_contents VALUES (88, '{"listingName":"Bracelet","offerPrice":5.2,"listingPhotoType":"storage","listingPhotoPath":"listings/05ad4436955019b09a51.jpeg","offerStartDate":"2025-09-01 00:00","offerFinishDate":"2025-09-05 00:00","description":"Hola, amigo"}', '2025-08-19 17:29:11.317909+02', '2025-08-19 17:29:11.317909+02', 88);
INSERT INTO public.chat_messages_contents VALUES (89, '{"requestId":7,"listingName":"Bracelet","offerPrice":5.2,"listingPhotoPath":"listings/05ad4436955019b09a51.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-09-08 00:00","offerStartDate":"2025-09-12 00:00"}', '2025-08-19 17:29:28.236612+02', '2025-08-19 17:29:28.236612+02', 89);
INSERT INTO public.chat_messages_contents VALUES (90, '{}', '2025-08-19 17:29:35.702983+02', '2025-08-19 17:29:35.702983+02', 90);
INSERT INTO public.chat_messages_contents VALUES (91, '{}', '2025-08-19 17:32:32.610272+02', '2025-08-19 17:32:32.610272+02', 91);
INSERT INTO public.chat_messages_contents VALUES (92, '{"description":"???","type":"problems-with-withdrawal","senderName":"Erica Kim","senderId":5}', '2025-08-19 17:32:44.656745+02', '2025-08-19 17:32:44.656745+02', 92);
INSERT INTO public.chat_messages_contents VALUES (93, '{"description":"???","type":"problems-with-withdrawal","senderName":"Erica Kim","senderId":5}', '2025-08-19 17:32:44.663529+02', '2025-08-19 17:32:44.663529+02', 93);
INSERT INTO public.chat_messages_contents VALUES (94, '{"description":"???","type":"problems-with-withdrawal"}', '2025-08-19 17:32:44.673695+02', '2025-08-19 17:32:44.673695+02', 94);
INSERT INTO public.chat_messages_contents VALUES (95, '{"listingName":"Bracelet","offerPrice":5.2,"listingPhotoType":"storage","listingPhotoPath":"listings/05ad4436955019b09a51.jpeg","offerStartDate":"2025-09-30 00:00","offerFinishDate":"2025-10-04 00:00","description":"test"}', '2025-08-19 17:34:56.788236+02', '2025-08-19 17:34:56.788236+02', 95);
INSERT INTO public.chat_messages_contents VALUES (96, '{"requestId":8,"listingName":"Bracelet","offerPrice":5.2,"listingPhotoPath":"listings/05ad4436955019b09a51.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-26 00:00","offerStartDate":"2025-08-29 00:00"}', '2025-08-19 17:37:54.005276+02', '2025-08-19 17:37:54.005276+02', 96);
INSERT INTO public.chat_messages_contents VALUES (97, '{"requestId":9,"listingName":"Bracelet","offerPrice":5.2,"listingPhotoPath":"listings/05ad4436955019b09a51.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-19 00:00","offerStartDate":"2025-08-22 00:00"}', '2025-08-19 17:38:05.148503+02', '2025-08-19 17:38:05.148503+02', 97);
INSERT INTO public.chat_messages_contents VALUES (98, '{}', '2025-08-19 17:38:11.06246+02', '2025-08-19 17:38:11.06246+02', 98);
INSERT INTO public.chat_messages_contents VALUES (99, '{}', '2025-08-19 17:38:27.201666+02', '2025-08-19 17:38:27.201666+02', 99);
INSERT INTO public.chat_messages_contents VALUES (100, '{}', '2025-08-19 17:41:08.470597+02', '2025-08-19 17:41:08.470597+02', 100);
INSERT INTO public.chat_messages_contents VALUES (101, '{"description":"done fail","type":"damage","senderName":"Holly Burgess","senderId":3}', '2025-08-19 17:41:24.752651+02', '2025-08-19 17:41:24.752651+02', 101);
INSERT INTO public.chat_messages_contents VALUES (102, '{"description":"done fail","type":"damage","senderName":"Holly Burgess","senderId":3}', '2025-08-19 17:41:24.75914+02', '2025-08-19 17:41:24.75914+02', 102);
INSERT INTO public.chat_messages_contents VALUES (103, '{"description":"done fail","type":"damage"}', '2025-08-19 17:41:24.764592+02', '2025-08-19 17:41:24.764592+02', 103);
INSERT INTO public.chat_messages_contents VALUES (104, '{"listingName":"Handbag","offerPrice":9.76,"listingPhotoType":"storage","listingPhotoPath":"listings/60db68cf451a03bfeac7.jpeg","offerStartDate":"2025-08-19 18:45","offerFinishDate":"2025-08-19 18:45","description":"cool"}', '2025-08-19 17:45:21.313307+02', '2025-08-19 17:45:21.313307+02', 104);
INSERT INTO public.chat_messages_contents VALUES (105, '{"requestId":10,"listingName":"Handbag","offerPrice":9.76,"listingPhotoPath":"listings/60db68cf451a03bfeac7.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-20 00:00","offerStartDate":"2025-08-20 00:00"}', '2025-08-19 17:45:39.71611+02', '2025-08-19 17:45:39.71611+02', 105);
INSERT INTO public.chat_messages_contents VALUES (106, '{"requestId":11,"listingName":"Handbag","offerPrice":9.76,"listingPhotoPath":"listings/60db68cf451a03bfeac7.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-21 00:00","offerStartDate":"2025-08-21 00:00"}', '2025-08-19 17:45:54.744606+02', '2025-08-19 17:45:54.744606+02', 106);
INSERT INTO public.chat_messages_contents VALUES (107, '{}', '2025-08-19 17:46:05.492555+02', '2025-08-19 17:46:05.492555+02', 107);
INSERT INTO public.chat_messages_contents VALUES (108, '{}', '2025-08-19 17:46:48.444082+02', '2025-08-19 17:46:48.444082+02', 108);
INSERT INTO public.chat_messages_contents VALUES (109, '{}', '2025-08-19 17:46:54.596739+02', '2025-08-19 17:46:54.596739+02', 109);
INSERT INTO public.chat_messages_contents VALUES (110, '{}', '2025-08-19 17:47:05.100468+02', '2025-08-19 17:47:05.100468+02', 110);
INSERT INTO public.chat_messages_contents VALUES (111, '{"listingName":"T-shirt","offerPrice":8.7,"listingPhotoType":"storage","listingPhotoPath":"listings/6f5d3a7e0e4870464cc6.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-23 00:00","description":"???"}', '2025-08-19 17:49:16.369781+02', '2025-08-19 17:49:16.369781+02', 111);
INSERT INTO public.chat_messages_contents VALUES (112, '{}', '2025-08-19 17:49:47.3755+02', '2025-08-19 17:49:47.3755+02', 112);
INSERT INTO public.chat_messages_contents VALUES (113, '{}', '2025-08-19 17:50:01.55836+02', '2025-08-19 17:50:01.55836+02', 113);
INSERT INTO public.chat_messages_contents VALUES (114, '{}', '2025-08-19 17:51:36.727949+02', '2025-08-19 17:51:36.727949+02', 114);
INSERT INTO public.chat_messages_contents VALUES (115, '{}', '2025-08-19 17:51:42.222243+02', '2025-08-19 17:51:42.222243+02', 115);
INSERT INTO public.chat_messages_contents VALUES (116, '{}', '2025-08-19 17:51:46.238588+02', '2025-08-19 17:51:46.238588+02', 116);
INSERT INTO public.chat_messages_contents VALUES (117, '{"listingName":"Shirt","offerPrice":7.8,"listingPhotoType":"storage","listingPhotoPath":"listings/cbaaa60bb424de0a09fe.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-29 00:00","description":"???"}', '2025-08-19 17:52:24.257029+02', '2025-08-19 17:52:24.257029+02', 117);
INSERT INTO public.chat_messages_contents VALUES (118, '{"requestId":12,"listingName":"Shirt","offerPrice":7.8,"listingPhotoPath":"listings/cbaaa60bb424de0a09fe.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-26 00:00","offerStartDate":"2025-09-05 00:00"}', '2025-08-19 17:52:42.177782+02', '2025-08-19 17:52:42.177782+02', 118);
INSERT INTO public.chat_messages_contents VALUES (119, '{}', '2025-08-19 17:52:48.176024+02', '2025-08-19 17:52:48.176024+02', 119);
INSERT INTO public.chat_messages_contents VALUES (120, '{}', '2025-08-19 17:53:28.922716+02', '2025-08-19 17:53:28.922716+02', 120);
INSERT INTO public.chat_messages_contents VALUES (121, '{}', '2025-08-19 17:53:32.929926+02', '2025-08-19 17:53:32.929926+02', 121);
INSERT INTO public.chat_messages_contents VALUES (122, '{"description":"????","type":"others","senderName":"Cynthia Clark","senderId":16}', '2025-08-19 17:53:45.803092+02', '2025-08-19 17:53:45.803092+02', 122);
INSERT INTO public.chat_messages_contents VALUES (123, '{"description":"????","type":"others","senderName":"Cynthia Clark","senderId":16}', '2025-08-19 17:53:45.805574+02', '2025-08-19 17:53:45.805574+02', 123);
INSERT INTO public.chat_messages_contents VALUES (124, '{"description":"????","type":"others"}', '2025-08-19 17:53:45.808136+02', '2025-08-19 17:53:45.808136+02', 124);
INSERT INTO public.chat_messages_contents VALUES (125, '{"listingName":"Sunglasses","offerPrice":7.2,"listingPhotoType":"storage","listingPhotoPath":"listings/d9c9758cb6b06f9b21b5.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-22 00:00","description":"???"}', '2025-08-19 18:00:59.651356+02', '2025-08-19 18:00:59.651356+02', 125);
INSERT INTO public.chat_messages_contents VALUES (126, '{}', '2025-08-19 18:01:07.960854+02', '2025-08-19 18:01:07.960854+02', 126);
INSERT INTO public.chat_messages_contents VALUES (127, '{}', '2025-08-19 18:01:28.507168+02', '2025-08-19 18:01:28.507168+02', 127);
INSERT INTO public.chat_messages_contents VALUES (128, '{"description":"???","type":"damage","senderName":"Matthew Moss","senderId":9}', '2025-08-19 18:01:38.036722+02', '2025-08-19 18:01:38.036722+02', 128);
INSERT INTO public.chat_messages_contents VALUES (129, '{"description":"???","type":"damage","senderName":"Matthew Moss","senderId":9}', '2025-08-19 18:01:38.04013+02', '2025-08-19 18:01:38.04013+02', 129);
INSERT INTO public.chat_messages_contents VALUES (130, '{"description":"???","type":"damage"}', '2025-08-19 18:01:38.042747+02', '2025-08-19 18:01:38.042747+02', 130);
INSERT INTO public.chat_messages_contents VALUES (131, '{"listingName":"Sunglasses","offerPrice":7.2,"listingPhotoType":"storage","listingPhotoPath":"listings/d9c9758cb6b06f9b21b5.jpeg","offerStartDate":"2025-08-26 00:00","offerFinishDate":"2025-08-28 00:00","description":"???"}', '2025-08-19 18:02:16.14595+02', '2025-08-19 18:02:16.14595+02', 131);
INSERT INTO public.chat_messages_contents VALUES (132, '{}', '2025-08-19 18:02:35.418001+02', '2025-08-19 18:02:35.418001+02', 132);
INSERT INTO public.chat_messages_contents VALUES (133, '{}', '2025-08-19 18:03:13.456612+02', '2025-08-19 18:03:13.456612+02', 133);
INSERT INTO public.chat_messages_contents VALUES (134, '{"description":"???","type":"damage","senderName":"Tanya Clayton","senderId":11}', '2025-08-19 18:03:29.367155+02', '2025-08-19 18:03:29.367155+02', 134);
INSERT INTO public.chat_messages_contents VALUES (135, '{"description":"???","type":"damage","senderName":"Tanya Clayton","senderId":11}', '2025-08-19 18:03:29.370217+02', '2025-08-19 18:03:29.370217+02', 135);
INSERT INTO public.chat_messages_contents VALUES (136, '{"description":"???","type":"damage"}', '2025-08-19 18:03:29.37371+02', '2025-08-19 18:03:29.37371+02', 136);
INSERT INTO public.chat_messages_contents VALUES (137, '{"listingName":"Jacket","offerPrice":8.81,"listingPhotoType":"storage","listingPhotoPath":"listings/bd50155361b8a3a05d46.jpeg","offerStartDate":"2025-09-02 00:00","offerFinishDate":"2025-09-05 00:00","description":"???"}', '2025-08-19 18:04:10.713556+02', '2025-08-19 18:04:10.713556+02', 137);
INSERT INTO public.chat_messages_contents VALUES (138, '{"requestId":13,"listingName":"Jacket","offerPrice":8.81,"listingPhotoPath":"listings/bd50155361b8a3a05d46.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-09-09 00:00","offerStartDate":"2025-09-12 00:00"}', '2025-08-19 18:04:28.862945+02', '2025-08-19 18:04:28.862945+02', 138);
INSERT INTO public.chat_messages_contents VALUES (139, '{}', '2025-08-19 18:04:38.925548+02', '2025-08-19 18:04:38.925548+02', 139);
INSERT INTO public.chat_messages_contents VALUES (140, '{}', '2025-08-19 18:04:47.137475+02', '2025-08-19 18:04:47.137475+02', 140);
INSERT INTO public.chat_messages_contents VALUES (141, '{}', '2025-08-19 18:05:04.965654+02', '2025-08-19 18:05:04.965654+02', 141);
INSERT INTO public.chat_messages_contents VALUES (142, '{"description":"???","type":"payment","senderName":"Matthew Moss","senderId":9}', '2025-08-19 18:05:14.059435+02', '2025-08-19 18:05:14.059435+02', 142);
INSERT INTO public.chat_messages_contents VALUES (143, '{"description":"???","type":"payment","senderName":"Matthew Moss","senderId":9}', '2025-08-19 18:05:14.062927+02', '2025-08-19 18:05:14.062927+02', 143);
INSERT INTO public.chat_messages_contents VALUES (144, '{"description":"???","type":"payment"}', '2025-08-19 18:05:14.06786+02', '2025-08-19 18:05:14.06786+02', 144);
INSERT INTO public.chat_messages_contents VALUES (145, '{"listingName":"Ankle boots","offerPrice":7.6,"listingPhotoType":"storage","listingPhotoPath":"listings/61de86d2dfa0470dfd30.jpeg","offerStartDate":"2025-08-26 00:00","offerFinishDate":"2025-08-29 00:00","description":"???"}', '2025-08-19 18:05:34.851362+02', '2025-08-19 18:05:34.851362+02', 145);
INSERT INTO public.chat_messages_contents VALUES (146, '{}', '2025-08-19 18:05:59.438749+02', '2025-08-19 18:05:59.438749+02', 146);
INSERT INTO public.chat_messages_contents VALUES (147, '{}', '2025-08-19 18:06:18.410023+02', '2025-08-19 18:06:18.410023+02', 147);
INSERT INTO public.chat_messages_contents VALUES (148, '{}', '2025-08-19 18:06:23.618127+02', '2025-08-19 18:06:23.618127+02', 148);
INSERT INTO public.chat_messages_contents VALUES (149, '{"description":"???","type":"damage","senderName":"Tanya Clayton","senderId":11}', '2025-08-19 18:06:29.24406+02', '2025-08-19 18:06:29.24406+02', 149);
INSERT INTO public.chat_messages_contents VALUES (150, '{"description":"???","type":"damage","senderName":"Tanya Clayton","senderId":11}', '2025-08-19 18:06:29.247478+02', '2025-08-19 18:06:29.247478+02', 150);
INSERT INTO public.chat_messages_contents VALUES (151, '{"description":"???","type":"damage"}', '2025-08-19 18:06:29.24944+02', '2025-08-19 18:06:29.24944+02', 151);
INSERT INTO public.chat_messages_contents VALUES (152, '{"listingName":"Blouse","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/d23cf7a2391ff46d1981.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-22 00:00","description":"???"}', '2025-08-19 18:10:56.040498+02', '2025-08-19 18:10:56.040498+02', 152);
INSERT INTO public.chat_messages_contents VALUES (153, '{}', '2025-08-19 18:11:04.072402+02', '2025-08-19 18:11:04.072402+02', 153);
INSERT INTO public.chat_messages_contents VALUES (154, '{}', '2025-08-19 18:11:26.049877+02', '2025-08-19 18:11:26.049877+02', 154);
INSERT INTO public.chat_messages_contents VALUES (155, '{}', '2025-08-19 18:11:36.58876+02', '2025-08-19 18:11:36.58876+02', 155);
INSERT INTO public.chat_messages_contents VALUES (156, '{}', '2025-08-19 18:11:43.028671+02', '2025-08-19 18:11:43.028671+02', 156);
INSERT INTO public.chat_messages_contents VALUES (157, '{"listingName":"Sweatshirt","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/fa217ab74559ae37f015.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-22 00:00","description":"???"}', '2025-08-19 18:15:20.681729+02', '2025-08-19 18:15:20.681729+02', 157);
INSERT INTO public.chat_messages_contents VALUES (158, '{"listingName":"Sweatshirt","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/fa217ab74559ae37f015.jpeg","offerStartDate":"2025-09-02 00:00","offerFinishDate":"2025-09-06 00:00","description":"???"}', '2025-08-19 18:15:33.495219+02', '2025-08-19 18:15:33.495219+02', 158);
INSERT INTO public.chat_messages_contents VALUES (159, '{}', '2025-08-19 18:15:45.234386+02', '2025-08-19 18:15:45.234386+02', 159);
INSERT INTO public.chat_messages_contents VALUES (160, '{}', '2025-08-19 18:15:47.82191+02', '2025-08-19 18:15:47.82191+02', 160);
INSERT INTO public.chat_messages_contents VALUES (161, '{}', '2025-08-19 18:16:06.640399+02', '2025-08-19 18:16:06.640399+02', 161);
INSERT INTO public.chat_messages_contents VALUES (162, '{}', '2025-08-19 18:16:21.371221+02', '2025-08-19 18:16:21.371221+02', 162);
INSERT INTO public.chat_messages_contents VALUES (163, '{"description":"???","type":"damage","senderName":"Juan Wilson","senderId":7}', '2025-08-19 18:16:51.597279+02', '2025-08-19 18:16:51.597279+02', 163);
INSERT INTO public.chat_messages_contents VALUES (164, '{"description":"???","type":"damage","senderName":"Juan Wilson","senderId":7}', '2025-08-19 18:16:51.599731+02', '2025-08-19 18:16:51.599731+02', 164);
INSERT INTO public.chat_messages_contents VALUES (165, '{"description":"???","type":"damage"}', '2025-08-19 18:16:51.601644+02', '2025-08-19 18:16:51.601644+02', 165);
INSERT INTO public.chat_messages_contents VALUES (166, '{}', '2025-08-19 18:16:57.984157+02', '2025-08-19 18:16:57.984157+02', 166);
INSERT INTO public.chat_messages_contents VALUES (167, '{}', '2025-08-19 18:17:02.916779+02', '2025-08-19 18:17:02.916779+02', 167);
INSERT INTO public.chat_messages_contents VALUES (168, '{"listingName":"Tracksuit","offerPrice":8.8,"listingPhotoType":"storage","listingPhotoPath":"listings/f9f4438c131237bc8f37.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-20 00:00","description":"???"}', '2025-08-19 18:26:42.281796+02', '2025-08-19 18:26:42.281796+02', 168);
INSERT INTO public.chat_messages_contents VALUES (169, '{}', '2025-08-19 18:27:08.322618+02', '2025-08-19 18:27:08.322618+02', 169);
INSERT INTO public.chat_messages_contents VALUES (170, '{}', '2025-08-19 18:27:23.181062+02', '2025-08-19 18:27:23.181062+02', 170);
INSERT INTO public.chat_messages_contents VALUES (171, '{}', '2025-08-19 18:27:34.315117+02', '2025-08-19 18:27:34.315117+02', 171);
INSERT INTO public.chat_messages_contents VALUES (172, '{}', '2025-08-19 18:27:42.368044+02', '2025-08-19 18:27:42.368044+02', 172);
INSERT INTO public.chat_messages_contents VALUES (173, '{"listingName":"Cap","offerPrice":8.95,"listingPhotoType":"storage","listingPhotoPath":"listings/3c363fc63514212542d2.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-09-06 00:00","description":"???"}', '2025-08-19 18:30:12.075378+02', '2025-08-19 18:30:12.075378+02', 173);
INSERT INTO public.chat_messages_contents VALUES (174, '{}', '2025-08-19 18:30:21.164+02', '2025-08-19 18:30:21.164+02', 174);
INSERT INTO public.chat_messages_contents VALUES (175, '{}', '2025-08-19 18:30:38.207574+02', '2025-08-19 18:30:38.207574+02', 175);
INSERT INTO public.chat_messages_contents VALUES (176, '{}', '2025-08-19 18:30:42.771155+02', '2025-08-19 18:30:42.771155+02', 176);
INSERT INTO public.chat_messages_contents VALUES (177, '{}', '2025-08-19 18:30:47.950071+02', '2025-08-19 18:30:47.950071+02', 177);
INSERT INTO public.chat_messages_contents VALUES (178, '{"listingName":"Leggings","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/bcd3b62935593bb19689.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-22 00:00","description":"???"}', '2025-08-19 18:31:00.337633+02', '2025-08-19 18:31:00.337633+02', 178);
INSERT INTO public.chat_messages_contents VALUES (179, '{}', '2025-08-19 18:31:08.938383+02', '2025-08-19 18:31:08.938383+02', 179);
INSERT INTO public.chat_messages_contents VALUES (180, '{}', '2025-08-19 18:31:19.138876+02', '2025-08-19 18:31:19.138876+02', 180);
INSERT INTO public.chat_messages_contents VALUES (181, '{}', '2025-08-19 18:31:37.15743+02', '2025-08-19 18:31:37.15743+02', 181);
INSERT INTO public.chat_messages_contents VALUES (182, '{}', '2025-08-19 18:31:42.699254+02', '2025-08-19 18:31:42.699254+02', 182);
INSERT INTO public.chat_messages_contents VALUES (183, '{}', '2025-08-19 18:31:47.630513+02', '2025-08-19 18:31:47.630513+02', 183);
INSERT INTO public.chat_messages_contents VALUES (184, '{"listingName":"Onesie","offerPrice":5.07,"listingPhotoType":"storage","listingPhotoPath":"listings/185a5bbafe20b1a19a92.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-27 00:00","description":"???"}', '2025-08-19 18:32:14.481262+02', '2025-08-19 18:32:14.481262+02', 184);
INSERT INTO public.chat_messages_contents VALUES (185, '{}', '2025-08-19 18:32:21.995655+02', '2025-08-19 18:32:21.995655+02', 185);
INSERT INTO public.chat_messages_contents VALUES (186, '{}', '2025-08-19 18:32:38.575109+02', '2025-08-19 18:32:38.575109+02', 186);
INSERT INTO public.chat_messages_contents VALUES (187, '{}', '2025-08-19 18:32:48.535907+02', '2025-08-19 18:32:48.535907+02', 187);
INSERT INTO public.chat_messages_contents VALUES (188, '{"description":"???","type":"damage","senderName":"Theresa Baker MD","senderId":12}', '2025-08-19 18:33:07.256409+02', '2025-08-19 18:33:07.256409+02', 188);
INSERT INTO public.chat_messages_contents VALUES (189, '{"description":"???","type":"damage","senderName":"Theresa Baker MD","senderId":12}', '2025-08-19 18:33:07.258317+02', '2025-08-19 18:33:07.258317+02', 189);
INSERT INTO public.chat_messages_contents VALUES (190, '{"description":"???","type":"damage"}', '2025-08-19 18:33:07.259908+02', '2025-08-19 18:33:07.259908+02', 190);
INSERT INTO public.chat_messages_contents VALUES (191, '{"listingName":"Onesie","offerPrice":5.07,"listingPhotoType":"storage","listingPhotoPath":"listings/185a5bbafe20b1a19a92.jpeg","offerStartDate":"2025-09-02 00:00","offerFinishDate":"2025-09-05 00:00","description":"???"}', '2025-08-19 18:33:27.645979+02', '2025-08-19 18:33:27.645979+02', 191);
INSERT INTO public.chat_messages_contents VALUES (192, '{}', '2025-08-19 18:33:45.136211+02', '2025-08-19 18:33:45.136211+02', 192);
INSERT INTO public.chat_messages_contents VALUES (193, '{}', '2025-08-19 18:34:05.81298+02', '2025-08-19 18:34:05.81298+02', 193);
INSERT INTO public.chat_messages_contents VALUES (194, '{}', '2025-08-19 18:34:10.732667+02', '2025-08-19 18:34:10.732667+02', 194);
INSERT INTO public.chat_messages_contents VALUES (195, '{"description":"???","type":"damage","senderName":"Joseph Mccall","senderId":14}', '2025-08-19 18:34:19.25493+02', '2025-08-19 18:34:19.25493+02', 195);
INSERT INTO public.chat_messages_contents VALUES (196, '{"description":"???","type":"damage","senderName":"Joseph Mccall","senderId":14}', '2025-08-19 18:34:19.257867+02', '2025-08-19 18:34:19.257867+02', 196);
INSERT INTO public.chat_messages_contents VALUES (197, '{"description":"???","type":"damage"}', '2025-08-19 18:34:19.26036+02', '2025-08-19 18:34:19.26036+02', 197);
INSERT INTO public.chat_messages_contents VALUES (198, '{"listingName":"Onesie","offerPrice":5.07,"listingPhotoType":"storage","listingPhotoPath":"listings/185a5bbafe20b1a19a92.jpeg","offerStartDate":"2025-08-19 19:34","offerFinishDate":"2025-08-19 19:34","description":"???"}', '2025-08-19 18:34:39.222832+02', '2025-08-19 18:34:39.222832+02', 198);
INSERT INTO public.chat_messages_contents VALUES (199, '{"requestId":14,"listingName":"Onesie","offerPrice":5.07,"listingPhotoPath":"listings/185a5bbafe20b1a19a92.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-27 00:00","offerStartDate":"2025-08-27 00:00"}', '2025-08-19 18:35:02.820524+02', '2025-08-19 18:35:02.820524+02', 199);
INSERT INTO public.chat_messages_contents VALUES (200, '{"requestId":15,"listingName":"Onesie","offerPrice":5.07,"listingPhotoPath":"listings/185a5bbafe20b1a19a92.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-09-03 00:00","offerStartDate":"2025-09-03 00:00"}', '2025-08-19 18:35:15.576195+02', '2025-08-19 18:35:15.576195+02', 200);
INSERT INTO public.chat_messages_contents VALUES (201, '{}', '2025-08-19 18:35:20.736976+02', '2025-08-19 18:35:20.736976+02', 201);
INSERT INTO public.chat_messages_contents VALUES (202, '{}', '2025-08-19 18:35:37.846795+02', '2025-08-19 18:35:37.846795+02', 202);
INSERT INTO public.chat_messages_contents VALUES (203, '{"description":"???","type":"damage","senderName":"Theresa Baker MD","senderId":12}', '2025-08-19 18:35:55.163434+02', '2025-08-19 18:35:55.163434+02', 203);
INSERT INTO public.chat_messages_contents VALUES (204, '{"description":"???","type":"damage","senderName":"Theresa Baker MD","senderId":12}', '2025-08-19 18:35:55.166399+02', '2025-08-19 18:35:55.166399+02', 204);
INSERT INTO public.chat_messages_contents VALUES (205, '{"description":"???","type":"damage"}', '2025-08-19 18:35:55.168529+02', '2025-08-19 18:35:55.168529+02', 205);
INSERT INTO public.chat_messages_contents VALUES (206, '{"listingName":"Flip flops","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/893ff7795d3ce22db4cb.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-23 00:00","description":"???"}', '2025-08-19 18:40:33.006446+02', '2025-08-19 18:40:33.006446+02', 206);
INSERT INTO public.chat_messages_contents VALUES (207, '{"listingName":"Flip flops","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/893ff7795d3ce22db4cb.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-22 00:00","description":"???"}', '2025-08-19 18:40:40.281315+02', '2025-08-19 18:40:40.281315+02', 207);
INSERT INTO public.chat_messages_contents VALUES (208, '{}', '2025-08-19 18:40:59.770119+02', '2025-08-19 18:40:59.770119+02', 208);
INSERT INTO public.chat_messages_contents VALUES (209, '{}', '2025-08-19 18:41:01.323174+02', '2025-08-19 18:41:01.323174+02', 209);
INSERT INTO public.chat_messages_contents VALUES (210, '{}', '2025-08-19 18:41:27.186403+02', '2025-08-19 18:41:27.186403+02', 210);
INSERT INTO public.chat_messages_contents VALUES (211, '{}', '2025-08-19 18:41:32.661922+02', '2025-08-19 18:41:32.661922+02', 211);
INSERT INTO public.chat_messages_contents VALUES (212, '{"description":"???","type":"damage","senderName":"Joseph Mccall","senderId":14}', '2025-08-19 18:41:34.537546+02', '2025-08-19 18:41:34.537546+02', 212);
INSERT INTO public.chat_messages_contents VALUES (213, '{"description":"???","type":"damage","senderName":"Joseph Mccall","senderId":14}', '2025-08-19 18:41:34.539954+02', '2025-08-19 18:41:34.539954+02', 213);
INSERT INTO public.chat_messages_contents VALUES (214, '{"description":"???","type":"damage"}', '2025-08-19 18:41:34.542422+02', '2025-08-19 18:41:34.542422+02', 214);
INSERT INTO public.chat_messages_contents VALUES (215, '{}', '2025-08-19 18:41:40.513916+02', '2025-08-19 18:41:40.513916+02', 215);
INSERT INTO public.chat_messages_contents VALUES (216, '{"description":"??","type":"damage","senderName":"Theresa Baker MD","senderId":12}', '2025-08-19 18:41:49.422171+02', '2025-08-19 18:41:49.422171+02', 216);
INSERT INTO public.chat_messages_contents VALUES (217, '{"description":"??","type":"damage","senderName":"Theresa Baker MD","senderId":12}', '2025-08-19 18:41:49.424879+02', '2025-08-19 18:41:49.424879+02', 217);
INSERT INTO public.chat_messages_contents VALUES (218, '{"description":"??","type":"damage"}', '2025-08-19 18:41:49.426986+02', '2025-08-19 18:41:49.426986+02', 218);
INSERT INTO public.chat_messages_contents VALUES (219, '{"listingName":"Flip flops","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/893ff7795d3ce22db4cb.jpeg","offerStartDate":"2025-08-25 00:00","offerFinishDate":"2025-08-28 00:00","description":"???"}', '2025-08-19 18:42:48.0969+02', '2025-08-19 18:42:48.0969+02', 219);
INSERT INTO public.chat_messages_contents VALUES (220, '{"listingName":"Flip flops","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/893ff7795d3ce22db4cb.jpeg","offerStartDate":"2025-08-27 00:00","offerFinishDate":"2025-08-29 00:00","description":"???"}', '2025-08-19 18:43:03.047668+02', '2025-08-19 18:43:03.047668+02', 220);
INSERT INTO public.chat_messages_contents VALUES (221, '{}', '2025-08-19 18:43:08.847355+02', '2025-08-19 18:43:08.847355+02', 221);
INSERT INTO public.chat_messages_contents VALUES (222, '{}', '2025-08-19 18:43:10.53705+02', '2025-08-19 18:43:10.53705+02', 222);
INSERT INTO public.chat_messages_contents VALUES (223, '{}', '2025-08-19 18:43:32.602731+02', '2025-08-19 18:43:32.602731+02', 223);
INSERT INTO public.chat_messages_contents VALUES (224, '{"description":"???","type":"damage","senderName":"Theresa Baker MD","senderId":12}', '2025-08-19 18:43:38.815481+02', '2025-08-19 18:43:38.815481+02', 224);
INSERT INTO public.chat_messages_contents VALUES (225, '{"description":"???","type":"damage","senderName":"Theresa Baker MD","senderId":12}', '2025-08-19 18:43:38.817993+02', '2025-08-19 18:43:38.817993+02', 225);
INSERT INTO public.chat_messages_contents VALUES (226, '{"description":"???","type":"damage"}', '2025-08-19 18:43:38.819788+02', '2025-08-19 18:43:38.819788+02', 226);
INSERT INTO public.chat_messages_contents VALUES (227, '{}', '2025-08-19 18:43:38.873184+02', '2025-08-19 18:43:38.873184+02', 227);
INSERT INTO public.chat_messages_contents VALUES (228, '{"description":"???","type":"damage","senderName":"Theresa Baker MD","senderId":12}', '2025-08-19 18:43:43.528387+02', '2025-08-19 18:43:43.528387+02', 228);
INSERT INTO public.chat_messages_contents VALUES (229, '{"description":"???","type":"damage","senderName":"Theresa Baker MD","senderId":12}', '2025-08-19 18:43:43.529903+02', '2025-08-19 18:43:43.529903+02', 229);
INSERT INTO public.chat_messages_contents VALUES (230, '{"description":"???","type":"damage"}', '2025-08-19 18:43:43.531701+02', '2025-08-19 18:43:43.531701+02', 230);
INSERT INTO public.chat_messages_contents VALUES (231, '{"listingName":"Flip flops","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/893ff7795d3ce22db4cb.jpeg","offerStartDate":"2025-09-03 00:00","offerFinishDate":"2025-09-04 00:00","description":"??"}', '2025-08-19 18:44:14.481501+02', '2025-08-19 18:44:14.481501+02', 231);
INSERT INTO public.chat_messages_contents VALUES (232, '{"listingName":"Flip flops","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/893ff7795d3ce22db4cb.jpeg","offerStartDate":"2025-09-04 00:00","offerFinishDate":"2025-09-06 00:00","description":"??"}', '2025-08-19 18:44:20.443102+02', '2025-08-19 18:44:20.443102+02', 232);
INSERT INTO public.chat_messages_contents VALUES (233, '{}', '2025-08-19 18:44:26.453123+02', '2025-08-19 18:44:26.453123+02', 233);
INSERT INTO public.chat_messages_contents VALUES (234, '{}', '2025-08-19 18:44:28.040792+02', '2025-08-19 18:44:28.040792+02', 234);
INSERT INTO public.chat_messages_contents VALUES (235, '{}', '2025-08-19 18:44:46.901404+02', '2025-08-19 18:44:46.901404+02', 235);
INSERT INTO public.chat_messages_contents VALUES (236, '{}', '2025-08-19 18:44:57.572322+02', '2025-08-19 18:44:57.572322+02', 236);
INSERT INTO public.chat_messages_contents VALUES (237, '{}', '2025-08-19 18:45:04.859128+02', '2025-08-19 18:45:04.859128+02', 237);
INSERT INTO public.chat_messages_contents VALUES (238, '{}', '2025-08-19 18:45:26.307959+02', '2025-08-19 18:45:26.307959+02', 238);
INSERT INTO public.chat_messages_contents VALUES (239, '{"description":"??","type":"damage","senderName":"Cheryl Keith","senderId":13}', '2025-08-19 18:45:32.08818+02', '2025-08-19 18:45:32.08818+02', 239);
INSERT INTO public.chat_messages_contents VALUES (240, '{"description":"??","type":"damage","senderName":"Cheryl Keith","senderId":13}', '2025-08-19 18:45:32.090492+02', '2025-08-19 18:45:32.090492+02', 240);
INSERT INTO public.chat_messages_contents VALUES (241, '{"description":"??","type":"damage"}', '2025-08-19 18:45:32.092463+02', '2025-08-19 18:45:32.092463+02', 241);
INSERT INTO public.chat_messages_contents VALUES (243, '{"listingName":"Tracksuit","offerPrice":8.8,"listingPhotoType":"storage","listingPhotoPath":"listings/f9f4438c131237bc8f37.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-21 00:00","description":"???"}', '2025-08-19 19:05:49.96823+02', '2025-08-19 19:05:49.96823+02', 243);
INSERT INTO public.chat_messages_contents VALUES (244, '{"listingName":"Leggings","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/bcd3b62935593bb19689.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-21 00:00","description":"???"}', '2025-08-19 19:06:07.673601+02', '2025-08-19 19:06:07.673601+02', 244);
INSERT INTO public.chat_messages_contents VALUES (245, '{"requestId":16,"listingName":"Tracksuit","offerPrice":8.8,"listingPhotoPath":"listings/f9f4438c131237bc8f37.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-26 00:00","offerStartDate":"2025-08-28 00:00"}', '2025-08-19 19:06:27.302506+02', '2025-08-19 19:06:27.302506+02', 245);
INSERT INTO public.chat_messages_contents VALUES (246, '{"requestId":17,"listingName":"Leggings","offerPrice":5,"listingPhotoPath":"listings/bcd3b62935593bb19689.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-09-02 00:00","offerStartDate":"2025-09-04 00:00"}', '2025-08-19 19:06:33.048347+02', '2025-08-19 19:06:33.048347+02', 246);
INSERT INTO public.chat_messages_contents VALUES (247, '{}', '2025-08-19 19:06:38.59822+02', '2025-08-19 19:06:38.59822+02', 247);
INSERT INTO public.chat_messages_contents VALUES (248, '{}', '2025-08-19 19:06:41.299396+02', '2025-08-19 19:06:41.299396+02', 248);
INSERT INTO public.chat_messages_contents VALUES (249, '{}', '2025-08-19 19:06:57.332866+02', '2025-08-19 19:06:57.332866+02', 249);
INSERT INTO public.chat_messages_contents VALUES (250, '{}', '2025-08-19 19:07:23.073813+02', '2025-08-19 19:07:23.073813+02', 250);
INSERT INTO public.chat_messages_contents VALUES (251, '{}', '2025-08-19 19:07:27.633323+02', '2025-08-19 19:07:27.633323+02', 251);
INSERT INTO public.chat_messages_contents VALUES (252, '{}', '2025-08-19 19:07:35.915461+02', '2025-08-19 19:07:35.915461+02', 252);
INSERT INTO public.chat_messages_contents VALUES (253, '{}', '2025-08-19 19:07:39.896835+02', '2025-08-19 19:07:39.896835+02', 253);
INSERT INTO public.chat_messages_contents VALUES (254, '{}', '2025-08-19 19:07:56.553617+02', '2025-08-19 19:07:56.553617+02', 254);
INSERT INTO public.chat_messages_contents VALUES (255, '{}', '2025-08-19 19:08:01.091153+02', '2025-08-19 19:08:01.091153+02', 255);
INSERT INTO public.chat_messages_contents VALUES (256, '{"listingName":"Leggings","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/bcd3b62935593bb19689.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-26 00:00","description":"???"}', '2025-08-19 19:09:33.929518+02', '2025-08-19 19:09:33.929518+02', 256);
INSERT INTO public.chat_messages_contents VALUES (257, '{"listingName":"Leggings","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/bcd3b62935593bb19689.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-09-06 00:00","description":"???"}', '2025-08-19 19:09:45.076413+02', '2025-08-19 19:09:45.076413+02', 257);
INSERT INTO public.chat_messages_contents VALUES (258, '{"requestId":18,"listingName":"Leggings","offerPrice":5,"listingPhotoPath":"listings/bcd3b62935593bb19689.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-19 00:00","offerStartDate":"2025-09-06 00:00"}', '2025-08-19 19:09:54.291505+02', '2025-08-19 19:09:54.291505+02', 258);
INSERT INTO public.chat_messages_contents VALUES (259, '{"requestId":19,"listingName":"Leggings","offerPrice":5,"listingPhotoPath":"listings/bcd3b62935593bb19689.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-26 00:00","offerStartDate":"2025-09-02 00:00"}', '2025-08-19 19:10:01.775362+02', '2025-08-19 19:10:01.775362+02', 259);
INSERT INTO public.chat_messages_contents VALUES (260, '{"requestId":20,"listingName":"Leggings","offerPrice":5,"listingPhotoPath":"listings/bcd3b62935593bb19689.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-09-02 00:00","offerStartDate":"2025-09-09 00:00"}', '2025-08-19 19:10:11.689639+02', '2025-08-19 19:10:11.689639+02', 260);
INSERT INTO public.chat_messages_contents VALUES (261, '{"requestId":21,"listingName":"Leggings","offerPrice":5,"listingPhotoPath":"listings/bcd3b62935593bb19689.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-09-23 00:00","offerStartDate":"2025-10-11 00:00"}', '2025-08-19 19:10:24.846316+02', '2025-08-19 19:10:24.846316+02', 261);
INSERT INTO public.chat_messages_contents VALUES (262, '{}', '2025-08-19 19:10:30.593372+02', '2025-08-19 19:10:30.593372+02', 262);
INSERT INTO public.chat_messages_contents VALUES (263, '{}', '2025-08-19 19:10:32.271339+02', '2025-08-19 19:10:32.271339+02', 263);
INSERT INTO public.chat_messages_contents VALUES (264, '{}', '2025-08-19 19:10:56.84068+02', '2025-08-19 19:10:56.84068+02', 264);
INSERT INTO public.chat_messages_contents VALUES (265, '{}', '2025-08-19 19:11:05.525847+02', '2025-08-19 19:11:05.525847+02', 265);
INSERT INTO public.chat_messages_contents VALUES (266, '{}', '2025-08-19 19:11:28.422624+02', '2025-08-19 19:11:28.422624+02', 266);
INSERT INTO public.chat_messages_contents VALUES (267, '{}', '2025-08-19 19:12:17.988825+02', '2025-08-19 19:12:17.988825+02', 267);
INSERT INTO public.chat_messages_contents VALUES (268, '{}', '2025-08-19 19:12:21.60804+02', '2025-08-19 19:12:21.60804+02', 268);
INSERT INTO public.chat_messages_contents VALUES (269, '{}', '2025-08-19 19:12:24.585044+02', '2025-08-19 19:12:24.585044+02', 269);
INSERT INTO public.chat_messages_contents VALUES (270, '{}', '2025-08-19 19:12:26.511492+02', '2025-08-19 19:12:26.511492+02', 270);
INSERT INTO public.chat_messages_contents VALUES (271, '{"listingName":"Sunglasses","offerPrice":7.2,"listingPhotoType":"storage","listingPhotoPath":"listings/d9c9758cb6b06f9b21b5.jpeg","offerStartDate":"2025-08-19 20:15","offerFinishDate":"2025-08-19 20:15","description":"???"}', '2025-08-19 19:15:36.93646+02', '2025-08-19 19:15:36.93646+02', 271);
INSERT INTO public.chat_messages_contents VALUES (272, '{"listingName":"Toddler Girl Dresses","offerPrice":7.61,"listingPhotoType":"storage","listingPhotoPath":"listings/ecd7297464328db5c2bc.jpeg","offerStartDate":"2025-09-06 00:00","offerFinishDate":"2025-09-06 00:00","description":"???"}', '2025-08-19 19:16:27.6413+02', '2025-08-19 19:16:27.6413+02', 272);
INSERT INTO public.chat_messages_contents VALUES (273, '{}', '2025-08-19 19:16:35.179453+02', '2025-08-19 19:16:35.179453+02', 273);
INSERT INTO public.chat_messages_contents VALUES (274, '{"requestId":22,"listingName":"Sunglasses","offerPrice":7.2,"listingPhotoPath":"listings/d9c9758cb6b06f9b21b5.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-09-03 00:00","offerStartDate":"2025-09-03 00:00"}', '2025-08-19 19:16:39.393723+02', '2025-08-19 19:16:39.393723+02', 274);
INSERT INTO public.chat_messages_contents VALUES (275, '{}', '2025-08-19 19:16:42.797838+02', '2025-08-19 19:16:42.797838+02', 275);
INSERT INTO public.chat_messages_contents VALUES (276, '{}', '2025-08-19 19:16:57.678125+02', '2025-08-19 19:16:57.678125+02', 276);
INSERT INTO public.chat_messages_contents VALUES (277, '{"description":"???","type":"damage","senderName":"Cheryl Keith","senderId":13}', '2025-08-19 19:17:07.720049+02', '2025-08-19 19:17:07.720049+02', 277);
INSERT INTO public.chat_messages_contents VALUES (278, '{"description":"???","type":"damage","senderName":"Cheryl Keith","senderId":13}', '2025-08-19 19:17:07.723043+02', '2025-08-19 19:17:07.723043+02', 278);
INSERT INTO public.chat_messages_contents VALUES (279, '{"description":"???","type":"damage"}', '2025-08-19 19:17:07.725568+02', '2025-08-19 19:17:07.725568+02', 279);
INSERT INTO public.chat_messages_contents VALUES (280, '{}', '2025-08-19 19:17:18.417634+02', '2025-08-19 19:17:18.417634+02', 280);
INSERT INTO public.chat_messages_contents VALUES (281, '{}', '2025-08-19 19:17:53.764822+02', '2025-08-19 19:17:53.764822+02', 281);
INSERT INTO public.chat_messages_contents VALUES (282, '{"description":"?????","type":"payment","senderName":"Sara Mueller","senderId":10}', '2025-08-19 19:18:02.55582+02', '2025-08-19 19:18:02.55582+02', 282);
INSERT INTO public.chat_messages_contents VALUES (283, '{"description":"?????","type":"payment","senderName":"Sara Mueller","senderId":10}', '2025-08-19 19:18:02.55843+02', '2025-08-19 19:18:02.55843+02', 283);
INSERT INTO public.chat_messages_contents VALUES (284, '{"description":"?????","type":"payment"}', '2025-08-19 19:18:02.560098+02', '2025-08-19 19:18:02.560098+02', 284);
INSERT INTO public.chat_messages_contents VALUES (285, '{"listingName":"Blouse","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/d23cf7a2391ff46d1981.jpeg","offerStartDate":"2025-08-24 00:00","offerFinishDate":"2025-08-28 00:00","description":"???"}', '2025-08-19 19:18:57.05604+02', '2025-08-19 19:18:57.05604+02', 285);
INSERT INTO public.chat_messages_contents VALUES (286, '{"requestId":23,"listingName":"Blouse","offerPrice":5,"listingPhotoPath":"listings/d23cf7a2391ff46d1981.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-31 00:00","offerStartDate":"2025-09-04 00:00"}', '2025-08-19 19:19:09.006987+02', '2025-08-19 19:19:09.006987+02', 286);
INSERT INTO public.chat_messages_contents VALUES (287, '{"requestId":24,"listingName":"Blouse","offerPrice":5,"listingPhotoPath":"listings/d23cf7a2391ff46d1981.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-24 00:00","offerStartDate":"2025-08-26 00:00"}', '2025-08-19 19:19:22.942697+02', '2025-08-19 19:19:22.942697+02', 287);
INSERT INTO public.chat_messages_contents VALUES (288, '{"requestId":25,"listingName":"Blouse","offerPrice":5,"listingPhotoPath":"listings/d23cf7a2391ff46d1981.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-09-07 00:00","offerStartDate":"2025-09-11 00:00"}', '2025-08-19 19:19:32.293395+02', '2025-08-19 19:19:32.293395+02', 288);
INSERT INTO public.chat_messages_contents VALUES (289, '{}', '2025-08-19 19:19:37.753306+02', '2025-08-19 19:19:37.753306+02', 289);
INSERT INTO public.chat_messages_contents VALUES (290, '{}', '2025-08-19 19:19:51.260516+02', '2025-08-19 19:19:51.260516+02', 290);
INSERT INTO public.chat_messages_contents VALUES (291, '{}', '2025-08-19 19:19:55.195035+02', '2025-08-19 19:19:55.195035+02', 291);
INSERT INTO public.chat_messages_contents VALUES (292, '{"description":"???","type":"damage","senderName":"Sara Mueller","senderId":10}', '2025-08-19 19:20:01.367259+02', '2025-08-19 19:20:01.367259+02', 292);
INSERT INTO public.chat_messages_contents VALUES (293, '{"description":"???","type":"damage","senderName":"Sara Mueller","senderId":10}', '2025-08-19 19:20:01.370166+02', '2025-08-19 19:20:01.370166+02', 293);
INSERT INTO public.chat_messages_contents VALUES (294, '{"description":"???","type":"damage"}', '2025-08-19 19:20:01.371817+02', '2025-08-19 19:20:01.371817+02', 294);
INSERT INTO public.chat_messages_contents VALUES (295, '{"listingName":"Ankle boots","offerPrice":7.6,"listingPhotoType":"storage","listingPhotoPath":"listings/61de86d2dfa0470dfd30.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-19 00:00","description":"????"}', '2025-08-19 19:20:56.625965+02', '2025-08-19 19:20:56.625965+02', 295);
INSERT INTO public.chat_messages_contents VALUES (296, '{}', '2025-08-19 19:21:02.651411+02', '2025-08-19 19:21:02.651411+02', 296);
INSERT INTO public.chat_messages_contents VALUES (297, '{}', '2025-08-19 19:21:11.233215+02', '2025-08-19 19:21:11.233215+02', 297);
INSERT INTO public.chat_messages_contents VALUES (298, '{}', '2025-08-19 19:21:19.055868+02', '2025-08-19 19:21:19.055868+02', 298);
INSERT INTO public.chat_messages_contents VALUES (299, '{}', '2025-08-19 19:21:23.5401+02', '2025-08-19 19:21:23.5401+02', 299);
INSERT INTO public.chat_messages_contents VALUES (300, '{}', '2025-08-19 19:21:28.394158+02', '2025-08-19 19:21:28.394158+02', 300);
INSERT INTO public.chat_messages_contents VALUES (301, '{"listingName":"Ring","offerPrice":6.06,"listingPhotoType":"storage","listingPhotoPath":"listings/e111a05c272704030bc2.jpeg","offerStartDate":"2025-08-19 00:00","offerFinishDate":"2025-08-19 00:00","description":"123"}', '2025-08-19 19:30:22.67916+02', '2025-08-19 19:30:22.67916+02', 301);
INSERT INTO public.chat_messages_contents VALUES (302, '{"listingName":"Ring","offerPrice":6.06,"listingPhotoType":"storage","listingPhotoPath":"listings/e111a05c272704030bc2.jpeg","offerStartDate":"2025-08-26 00:00","offerFinishDate":"2025-08-26 00:00","description":"123"}', '2025-08-19 19:30:32.078504+02', '2025-08-19 19:30:32.078504+02', 302);
INSERT INTO public.chat_messages_contents VALUES (303, '{"requestId":26,"listingName":"Ring","offerPrice":6.06,"listingPhotoPath":"listings/e111a05c272704030bc2.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-09-02 00:00","offerStartDate":"2025-09-02 00:00"}', '2025-08-19 19:30:43.564808+02', '2025-08-19 19:30:43.564808+02', 303);
INSERT INTO public.chat_messages_contents VALUES (304, '{"requestId":27,"listingName":"Ring","offerPrice":6.06,"listingPhotoPath":"listings/e111a05c272704030bc2.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-09-09 00:00","offerStartDate":"2025-09-09 00:00"}', '2025-08-19 19:30:49.076365+02', '2025-08-19 19:30:49.076365+02', 304);
INSERT INTO public.chat_messages_contents VALUES (305, '{"requestId":28,"listingName":"Ring","offerPrice":6.06,"listingPhotoPath":"listings/e111a05c272704030bc2.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-26 00:00","offerStartDate":"2025-08-26 00:00"}', '2025-08-19 19:30:59.672969+02', '2025-08-19 19:30:59.672969+02', 305);
INSERT INTO public.chat_messages_contents VALUES (306, '{"requestId":29,"listingName":"Ring","offerPrice":6.06,"listingPhotoPath":"listings/e111a05c272704030bc2.jpeg","listingPhotoType":"storage","offerFinishDate":"2025-08-19 00:00","offerStartDate":"2025-08-19 00:00"}', '2025-08-19 19:31:09.844252+02', '2025-08-19 19:31:09.844252+02', 306);
INSERT INTO public.chat_messages_contents VALUES (307, '{}', '2025-08-19 19:31:15.481132+02', '2025-08-19 19:31:15.481132+02', 307);
INSERT INTO public.chat_messages_contents VALUES (308, '{}', '2025-08-19 19:31:16.888154+02', '2025-08-19 19:31:16.888154+02', 308);
INSERT INTO public.chat_messages_contents VALUES (309, '{}', '2025-08-19 19:31:35.186327+02', '2025-08-19 19:31:35.186327+02', 309);
INSERT INTO public.chat_messages_contents VALUES (310, '{}', '2025-08-19 19:31:55.906106+02', '2025-08-19 19:31:55.906106+02', 310);
INSERT INTO public.chat_messages_contents VALUES (311, '{"description":"???","type":"damage","senderName":"Carrie Thomas","senderId":6}', '2025-08-19 19:32:05.441891+02', '2025-08-19 19:32:05.441891+02', 311);
INSERT INTO public.chat_messages_contents VALUES (312, '{"description":"???","type":"damage","senderName":"Carrie Thomas","senderId":6}', '2025-08-19 19:32:05.443782+02', '2025-08-19 19:32:05.443782+02', 312);
INSERT INTO public.chat_messages_contents VALUES (313, '{"description":"???","type":"damage"}', '2025-08-19 19:32:05.446652+02', '2025-08-19 19:32:05.446652+02', 313);
INSERT INTO public.chat_messages_contents VALUES (314, '{}', '2025-08-19 19:32:10.24986+02', '2025-08-19 19:32:10.24986+02', 314);
INSERT INTO public.chat_messages_contents VALUES (315, '{}', '2025-08-19 19:32:14.128369+02', '2025-08-19 19:32:14.128369+02', 315);
INSERT INTO public.chat_messages_contents VALUES (316, '{}', '2025-08-19 19:32:35.090703+02', '2025-08-19 19:32:35.090703+02', 316);
INSERT INTO public.chat_messages_contents VALUES (317, '{"listingName":"Ring","offerPrice":6.06,"listingPhotoType":"storage","listingPhotoPath":"listings/e111a05c272704030bc2.jpeg","offerStartDate":"2025-08-19 20:32","offerFinishDate":"2025-08-19 20:32","description":"???"}', '2025-08-19 19:32:49.563008+02', '2025-08-19 19:32:49.563008+02', 317);
INSERT INTO public.chat_messages_contents VALUES (318, '{"listingName":"Ring","offerPrice":6.06,"listingPhotoType":"storage","listingPhotoPath":"listings/e111a05c272704030bc2.jpeg","offerStartDate":"2025-08-19 20:32","offerFinishDate":"2025-08-19 20:32","description":"???"}', '2025-08-19 19:33:00.710632+02', '2025-08-19 19:33:00.710632+02', 318);
INSERT INTO public.chat_messages_contents VALUES (319, '{}', '2025-08-19 19:33:08.887876+02', '2025-08-19 19:33:08.887876+02', 319);
INSERT INTO public.chat_messages_contents VALUES (320, '{}', '2025-08-19 19:33:10.076264+02', '2025-08-19 19:33:10.076264+02', 320);
INSERT INTO public.chat_messages_contents VALUES (321, '{}', '2025-08-19 19:33:30.719388+02', '2025-08-19 19:33:30.719388+02', 321);
INSERT INTO public.chat_messages_contents VALUES (322, '{}', '2025-08-19 19:33:31.014797+02', '2025-08-19 19:33:31.014797+02', 322);
INSERT INTO public.chat_messages_contents VALUES (323, '{}', '2025-08-19 19:33:37.446342+02', '2025-08-19 19:33:37.446342+02', 323);
INSERT INTO public.chat_messages_contents VALUES (324, '{"description":"???","type":"damage","senderName":"Carrie Thomas","senderId":6}', '2025-08-19 19:33:47.943481+02', '2025-08-19 19:33:47.943481+02', 324);
INSERT INTO public.chat_messages_contents VALUES (325, '{"description":"???","type":"damage","senderName":"Carrie Thomas","senderId":6}', '2025-08-19 19:33:47.94619+02', '2025-08-19 19:33:47.94619+02', 325);
INSERT INTO public.chat_messages_contents VALUES (326, '{"description":"???","type":"damage"}', '2025-08-19 19:33:47.948165+02', '2025-08-19 19:33:47.948165+02', 326);
INSERT INTO public.chat_messages_contents VALUES (327, '{}', '2025-08-19 19:33:58.604233+02', '2025-08-19 19:33:58.604233+02', 327);
INSERT INTO public.chat_messages_contents VALUES (328, '{}', '2025-08-19 19:34:02.020183+02', '2025-08-19 19:34:02.020183+02', 328);
INSERT INTO public.chat_messages_contents VALUES (329, '{}', '2025-08-19 19:34:06.963806+02', '2025-08-19 19:34:06.963806+02', 329);
INSERT INTO public.chat_messages_contents VALUES (330, '{"listingName":"Sweater","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/80f2ac56a3f579d1b881.jpeg","offerStartDate":"2025-10-01 00:00","offerFinishDate":"2025-12-31 00:00","description":"???"}', '2025-08-19 19:38:06.535875+02', '2025-08-19 19:38:06.535875+02', 330);
INSERT INTO public.chat_messages_contents VALUES (331, '{"listingName":"Sweater","offerPrice":5,"listingPhotoType":"storage","listingPhotoPath":"listings/80f2ac56a3f579d1b881.jpeg","offerStartDate":"2025-09-01 00:00","offerFinishDate":"2025-11-30 00:00","description":"???"}', '2025-08-19 19:38:19.503955+02', '2025-08-19 19:38:19.503955+02', 331);
INSERT INTO public.chat_messages_contents VALUES (332, '{}', '2025-08-19 19:38:22.997075+02', '2025-08-19 19:38:22.997075+02', 332);
INSERT INTO public.chat_messages_contents VALUES (333, '{}', '2025-08-19 19:38:24.562075+02', '2025-08-19 19:38:24.562075+02', 333);
INSERT INTO public.chat_messages_contents VALUES (334, '{}', '2025-08-19 19:39:29.441579+02', '2025-08-19 19:39:29.441579+02', 334);
INSERT INTO public.chat_messages_contents VALUES (335, '{}', '2025-08-19 19:39:48.054102+02', '2025-08-19 19:39:48.054102+02', 335);
INSERT INTO public.chat_messages_contents VALUES (336, '{}', '2025-08-19 19:39:55.579354+02', '2025-08-19 19:39:55.579354+02', 336);
INSERT INTO public.chat_messages_contents VALUES (337, '{}', '2025-08-19 19:40:00.669175+02', '2025-08-19 19:40:00.669175+02', 337);
INSERT INTO public.chat_messages_contents VALUES (338, '{}', '2025-08-19 19:40:05.092512+02', '2025-08-19 19:40:05.092512+02', 338);
INSERT INTO public.chat_messages_contents VALUES (339, '{"description":"???","type":"damage","senderName":"Carrie Thomas","senderId":6}', '2025-08-19 19:40:10.861052+02', '2025-08-19 19:40:10.861052+02', 339);
INSERT INTO public.chat_messages_contents VALUES (340, '{"description":"???","type":"damage","senderName":"Carrie Thomas","senderId":6}', '2025-08-19 19:40:10.863507+02', '2025-08-19 19:40:10.863507+02', 340);
INSERT INTO public.chat_messages_contents VALUES (341, '{"description":"???","type":"damage"}', '2025-08-19 19:40:10.867045+02', '2025-08-19 19:40:10.867045+02', 341);


--
-- TOC entry 5217 (class 0 OID 962396)
-- Dependencies: 266
-- Data for Name: chat_relations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.chat_relations VALUES (1, false, '2025-08-10 12:44:29.630466+02', '2025-08-10 12:44:29.630466+02', 1, 1);
INSERT INTO public.chat_relations VALUES (2, false, '2025-08-10 12:44:29.633241+02', '2025-08-10 12:44:29.633241+02', 1, 2);
INSERT INTO public.chat_relations VALUES (4, false, '2025-08-18 17:31:01.431086+02', '2025-08-18 17:31:01.431086+02', 2, 4);
INSERT INTO public.chat_relations VALUES (119, false, '2025-08-19 18:44:20.441657+02', '2025-08-19 18:44:20.441657+02', 83, 12);
INSERT INTO public.chat_relations VALUES (3, true, '2025-08-18 17:31:01.423746+02', '2025-08-18 17:31:01.423746+02', 2, 3);
INSERT INTO public.chat_relations VALUES (5, true, '2025-08-18 18:28:45.503623+02', '2025-08-18 18:28:45.503623+02', 3, 3);
INSERT INTO public.chat_relations VALUES (120, false, '2025-08-19 18:44:20.442376+02', '2025-08-19 18:44:20.442376+02', 83, 13);
INSERT INTO public.chat_relations VALUES (6, true, '2025-08-18 18:28:45.509531+02', '2025-08-18 18:28:45.509531+02', 3, 4);
INSERT INTO public.chat_relations VALUES (7, false, '2025-08-18 18:36:30.013772+02', '2025-08-18 18:36:30.013772+02', 4, 3);
INSERT INTO public.chat_relations VALUES (8, false, '2025-08-18 18:36:30.014914+02', '2025-08-18 18:36:30.014914+02', 4, 4);
INSERT INTO public.chat_relations VALUES (9, false, '2025-08-18 18:37:30.164696+02', '2025-08-18 18:37:30.164696+02', 5, 4);
INSERT INTO public.chat_relations VALUES (10, false, '2025-08-18 18:37:30.171497+02', '2025-08-18 18:37:30.171497+02', 6, 3);
INSERT INTO public.chat_relations VALUES (11, false, '2025-08-18 18:39:23.354018+02', '2025-08-18 18:39:23.354018+02', 7, 3);
INSERT INTO public.chat_relations VALUES (12, false, '2025-08-18 18:39:23.355107+02', '2025-08-18 18:39:23.355107+02', 7, 4);
INSERT INTO public.chat_relations VALUES (13, false, '2025-08-18 18:40:26.426334+02', '2025-08-18 18:40:26.426334+02', 8, 4);
INSERT INTO public.chat_relations VALUES (14, false, '2025-08-18 18:40:26.433517+02', '2025-08-18 18:40:26.433517+02', 9, 3);
INSERT INTO public.chat_relations VALUES (16, false, '2025-08-18 18:43:31.11379+02', '2025-08-18 18:43:31.11379+02', 10, 4);
INSERT INTO public.chat_relations VALUES (15, true, '2025-08-18 18:43:31.112762+02', '2025-08-18 18:43:31.112762+02', 10, 6);
INSERT INTO public.chat_relations VALUES (17, false, '2025-08-18 18:53:53.256938+02', '2025-08-18 18:53:53.256938+02', 11, 6);
INSERT INTO public.chat_relations VALUES (18, false, '2025-08-18 18:53:53.262488+02', '2025-08-18 18:53:53.262488+02', 11, 4);
INSERT INTO public.chat_relations VALUES (19, false, '2025-08-18 18:56:54.166967+02', '2025-08-18 18:56:54.166967+02', 12, 4);
INSERT INTO public.chat_relations VALUES (20, false, '2025-08-18 18:56:54.173374+02', '2025-08-18 18:56:54.173374+02', 13, 6);
INSERT INTO public.chat_relations VALUES (21, false, '2025-08-18 19:06:52.834699+02', '2025-08-18 19:06:52.834699+02', 14, 6);
INSERT INTO public.chat_relations VALUES (22, false, '2025-08-18 19:06:52.840318+02', '2025-08-18 19:06:52.840318+02', 14, 4);
INSERT INTO public.chat_relations VALUES (23, false, '2025-08-18 19:08:47.604352+02', '2025-08-18 19:08:47.604352+02', 15, 6);
INSERT INTO public.chat_relations VALUES (24, false, '2025-08-18 19:08:47.607296+02', '2025-08-18 19:08:47.607296+02', 15, 4);
INSERT INTO public.chat_relations VALUES (25, false, '2025-08-18 19:10:04.725795+02', '2025-08-18 19:10:04.725795+02', 16, 4);
INSERT INTO public.chat_relations VALUES (26, false, '2025-08-18 19:10:04.732884+02', '2025-08-18 19:10:04.732884+02', 17, 6);
INSERT INTO public.chat_relations VALUES (27, false, '2025-08-18 19:11:21.049323+02', '2025-08-18 19:11:21.049323+02', 18, 3);
INSERT INTO public.chat_relations VALUES (28, false, '2025-08-18 19:11:21.050558+02', '2025-08-18 19:11:21.050558+02', 18, 4);
INSERT INTO public.chat_relations VALUES (29, false, '2025-08-18 19:12:52.435325+02', '2025-08-18 19:12:52.435325+02', 19, 4);
INSERT INTO public.chat_relations VALUES (30, false, '2025-08-18 19:12:52.442311+02', '2025-08-18 19:12:52.442311+02', 20, 3);
INSERT INTO public.chat_relations VALUES (31, false, '2025-08-18 19:13:42.439991+02', '2025-08-18 19:13:42.439991+02', 21, 3);
INSERT INTO public.chat_relations VALUES (32, false, '2025-08-18 19:13:42.441126+02', '2025-08-18 19:13:42.441126+02', 21, 4);
INSERT INTO public.chat_relations VALUES (33, false, '2025-08-18 19:14:31.474949+02', '2025-08-18 19:14:31.474949+02', 22, 4);
INSERT INTO public.chat_relations VALUES (34, false, '2025-08-18 19:14:31.480443+02', '2025-08-18 19:14:31.480443+02', 23, 3);
INSERT INTO public.chat_relations VALUES (35, false, '2025-08-18 19:14:52.503314+02', '2025-08-18 19:14:52.503314+02', 24, 3);
INSERT INTO public.chat_relations VALUES (36, false, '2025-08-18 19:14:52.505286+02', '2025-08-18 19:14:52.505286+02', 24, 4);
INSERT INTO public.chat_relations VALUES (37, false, '2025-08-18 19:17:28.592976+02', '2025-08-18 19:17:28.592976+02', 25, 4);
INSERT INTO public.chat_relations VALUES (38, false, '2025-08-18 19:17:28.599153+02', '2025-08-18 19:17:28.599153+02', 26, 3);
INSERT INTO public.chat_relations VALUES (39, false, '2025-08-18 19:26:31.744088+02', '2025-08-18 19:26:31.744088+02', 27, 3);
INSERT INTO public.chat_relations VALUES (40, false, '2025-08-18 19:26:31.74506+02', '2025-08-18 19:26:31.74506+02', 27, 4);
INSERT INTO public.chat_relations VALUES (41, false, '2025-08-18 19:27:29.62048+02', '2025-08-18 19:27:29.62048+02', 28, 4);
INSERT INTO public.chat_relations VALUES (42, false, '2025-08-18 19:27:29.626474+02', '2025-08-18 19:27:29.626474+02', 29, 3);
INSERT INTO public.chat_relations VALUES (43, false, '2025-08-19 17:29:11.266344+02', '2025-08-19 17:29:11.266344+02', 30, 3);
INSERT INTO public.chat_relations VALUES (44, false, '2025-08-19 17:29:11.270308+02', '2025-08-19 17:29:11.270308+02', 30, 5);
INSERT INTO public.chat_relations VALUES (45, false, '2025-08-19 17:32:44.653785+02', '2025-08-19 17:32:44.653785+02', 31, 5);
INSERT INTO public.chat_relations VALUES (46, false, '2025-08-19 17:32:44.66127+02', '2025-08-19 17:32:44.66127+02', 32, 3);
INSERT INTO public.chat_relations VALUES (47, false, '2025-08-19 17:34:56.783522+02', '2025-08-19 17:34:56.783522+02', 33, 3);
INSERT INTO public.chat_relations VALUES (48, false, '2025-08-19 17:34:56.784779+02', '2025-08-19 17:34:56.784779+02', 33, 5);
INSERT INTO public.chat_relations VALUES (49, false, '2025-08-19 17:41:24.750133+02', '2025-08-19 17:41:24.750133+02', 34, 5);
INSERT INTO public.chat_relations VALUES (50, false, '2025-08-19 17:41:24.757023+02', '2025-08-19 17:41:24.757023+02', 35, 3);
INSERT INTO public.chat_relations VALUES (51, false, '2025-08-19 17:45:21.311507+02', '2025-08-19 17:45:21.311507+02', 36, 3);
INSERT INTO public.chat_relations VALUES (52, false, '2025-08-19 17:45:21.311885+02', '2025-08-19 17:45:21.311885+02', 36, 8);
INSERT INTO public.chat_relations VALUES (53, false, '2025-08-19 17:49:16.365343+02', '2025-08-19 17:49:16.365343+02', 37, 16);
INSERT INTO public.chat_relations VALUES (54, false, '2025-08-19 17:49:16.365781+02', '2025-08-19 17:49:16.365781+02', 37, 8);
INSERT INTO public.chat_relations VALUES (55, false, '2025-08-19 17:52:24.255615+02', '2025-08-19 17:52:24.255615+02', 38, 16);
INSERT INTO public.chat_relations VALUES (56, false, '2025-08-19 17:52:24.256059+02', '2025-08-19 17:52:24.256059+02', 38, 5);
INSERT INTO public.chat_relations VALUES (57, false, '2025-08-19 17:53:45.801729+02', '2025-08-19 17:53:45.801729+02', 39, 5);
INSERT INTO public.chat_relations VALUES (58, false, '2025-08-19 17:53:45.80471+02', '2025-08-19 17:53:45.80471+02', 40, 16);
INSERT INTO public.chat_relations VALUES (59, false, '2025-08-19 18:00:59.649823+02', '2025-08-19 18:00:59.649823+02', 41, 10);
INSERT INTO public.chat_relations VALUES (60, false, '2025-08-19 18:00:59.6502+02', '2025-08-19 18:00:59.6502+02', 41, 9);
INSERT INTO public.chat_relations VALUES (61, false, '2025-08-19 18:01:38.034615+02', '2025-08-19 18:01:38.034615+02', 42, 9);
INSERT INTO public.chat_relations VALUES (62, false, '2025-08-19 18:01:38.038976+02', '2025-08-19 18:01:38.038976+02', 43, 10);
INSERT INTO public.chat_relations VALUES (63, false, '2025-08-19 18:02:16.14443+02', '2025-08-19 18:02:16.14443+02', 44, 10);
INSERT INTO public.chat_relations VALUES (64, false, '2025-08-19 18:02:16.144769+02', '2025-08-19 18:02:16.144769+02', 44, 11);
INSERT INTO public.chat_relations VALUES (65, false, '2025-08-19 18:03:29.365523+02', '2025-08-19 18:03:29.365523+02', 45, 11);
INSERT INTO public.chat_relations VALUES (66, false, '2025-08-19 18:03:29.369137+02', '2025-08-19 18:03:29.369137+02', 46, 10);
INSERT INTO public.chat_relations VALUES (67, false, '2025-08-19 18:04:10.712046+02', '2025-08-19 18:04:10.712046+02', 47, 10);
INSERT INTO public.chat_relations VALUES (68, false, '2025-08-19 18:04:10.712406+02', '2025-08-19 18:04:10.712406+02', 47, 9);
INSERT INTO public.chat_relations VALUES (69, false, '2025-08-19 18:05:14.058607+02', '2025-08-19 18:05:14.058607+02', 48, 9);
INSERT INTO public.chat_relations VALUES (70, false, '2025-08-19 18:05:14.061006+02', '2025-08-19 18:05:14.061006+02', 49, 10);
INSERT INTO public.chat_relations VALUES (71, false, '2025-08-19 18:05:34.84932+02', '2025-08-19 18:05:34.84932+02', 50, 10);
INSERT INTO public.chat_relations VALUES (72, false, '2025-08-19 18:05:34.850112+02', '2025-08-19 18:05:34.850112+02', 50, 11);
INSERT INTO public.chat_relations VALUES (73, false, '2025-08-19 18:06:29.243011+02', '2025-08-19 18:06:29.243011+02', 51, 11);
INSERT INTO public.chat_relations VALUES (74, false, '2025-08-19 18:06:29.245831+02', '2025-08-19 18:06:29.245831+02', 52, 10);
INSERT INTO public.chat_relations VALUES (75, false, '2025-08-19 18:10:56.034849+02', '2025-08-19 18:10:56.034849+02', 53, 10);
INSERT INTO public.chat_relations VALUES (76, false, '2025-08-19 18:10:56.036208+02', '2025-08-19 18:10:56.036208+02', 53, 9);
INSERT INTO public.chat_relations VALUES (77, false, '2025-08-19 18:15:20.680104+02', '2025-08-19 18:15:20.680104+02', 54, 7);
INSERT INTO public.chat_relations VALUES (78, false, '2025-08-19 18:15:20.68049+02', '2025-08-19 18:15:20.68049+02', 54, 11);
INSERT INTO public.chat_relations VALUES (79, false, '2025-08-19 18:15:33.493056+02', '2025-08-19 18:15:33.493056+02', 55, 7);
INSERT INTO public.chat_relations VALUES (80, false, '2025-08-19 18:15:33.493413+02', '2025-08-19 18:15:33.493413+02', 55, 9);
INSERT INTO public.chat_relations VALUES (81, false, '2025-08-19 18:16:51.596349+02', '2025-08-19 18:16:51.596349+02', 56, 9);
INSERT INTO public.chat_relations VALUES (82, false, '2025-08-19 18:16:51.59885+02', '2025-08-19 18:16:51.59885+02', 57, 7);
INSERT INTO public.chat_relations VALUES (83, false, '2025-08-19 18:26:42.274041+02', '2025-08-19 18:26:42.274041+02', 58, 12);
INSERT INTO public.chat_relations VALUES (84, false, '2025-08-19 18:26:42.27453+02', '2025-08-19 18:26:42.27453+02', 58, 13);
INSERT INTO public.chat_relations VALUES (85, false, '2025-08-19 18:30:12.069306+02', '2025-08-19 18:30:12.069306+02', 59, 12);
INSERT INTO public.chat_relations VALUES (86, false, '2025-08-19 18:30:12.069683+02', '2025-08-19 18:30:12.069683+02', 59, 14);
INSERT INTO public.chat_relations VALUES (87, false, '2025-08-19 18:31:00.336425+02', '2025-08-19 18:31:00.336425+02', 60, 12);
INSERT INTO public.chat_relations VALUES (88, false, '2025-08-19 18:31:00.336774+02', '2025-08-19 18:31:00.336774+02', 60, 13);
INSERT INTO public.chat_relations VALUES (89, false, '2025-08-19 18:32:14.479245+02', '2025-08-19 18:32:14.479245+02', 61, 12);
INSERT INTO public.chat_relations VALUES (90, false, '2025-08-19 18:32:14.479586+02', '2025-08-19 18:32:14.479586+02', 61, 13);
INSERT INTO public.chat_relations VALUES (91, false, '2025-08-19 18:33:07.255601+02', '2025-08-19 18:33:07.255601+02', 62, 13);
INSERT INTO public.chat_relations VALUES (92, false, '2025-08-19 18:33:07.257859+02', '2025-08-19 18:33:07.257859+02', 63, 12);
INSERT INTO public.chat_relations VALUES (93, false, '2025-08-19 18:33:27.644423+02', '2025-08-19 18:33:27.644423+02', 64, 12);
INSERT INTO public.chat_relations VALUES (94, false, '2025-08-19 18:33:27.645167+02', '2025-08-19 18:33:27.645167+02', 64, 14);
INSERT INTO public.chat_relations VALUES (95, false, '2025-08-19 18:34:19.253934+02', '2025-08-19 18:34:19.253934+02', 65, 14);
INSERT INTO public.chat_relations VALUES (96, false, '2025-08-19 18:34:19.256951+02', '2025-08-19 18:34:19.256951+02', 66, 12);
INSERT INTO public.chat_relations VALUES (97, false, '2025-08-19 18:34:39.221785+02', '2025-08-19 18:34:39.221785+02', 67, 12);
INSERT INTO public.chat_relations VALUES (98, false, '2025-08-19 18:34:39.22208+02', '2025-08-19 18:34:39.22208+02', 67, 13);
INSERT INTO public.chat_relations VALUES (99, false, '2025-08-19 18:35:55.162472+02', '2025-08-19 18:35:55.162472+02', 68, 13);
INSERT INTO public.chat_relations VALUES (100, false, '2025-08-19 18:35:55.165137+02', '2025-08-19 18:35:55.165137+02', 69, 12);
INSERT INTO public.chat_relations VALUES (101, false, '2025-08-19 18:40:33.003943+02', '2025-08-19 18:40:33.003943+02', 70, 12);
INSERT INTO public.chat_relations VALUES (102, false, '2025-08-19 18:40:33.005342+02', '2025-08-19 18:40:33.005342+02', 70, 14);
INSERT INTO public.chat_relations VALUES (103, false, '2025-08-19 18:40:40.280093+02', '2025-08-19 18:40:40.280093+02', 71, 12);
INSERT INTO public.chat_relations VALUES (104, false, '2025-08-19 18:40:40.280482+02', '2025-08-19 18:40:40.280482+02', 71, 13);
INSERT INTO public.chat_relations VALUES (105, false, '2025-08-19 18:41:34.536841+02', '2025-08-19 18:41:34.536841+02', 72, 14);
INSERT INTO public.chat_relations VALUES (106, false, '2025-08-19 18:41:34.538846+02', '2025-08-19 18:41:34.538846+02', 73, 12);
INSERT INTO public.chat_relations VALUES (107, false, '2025-08-19 18:41:49.421474+02', '2025-08-19 18:41:49.421474+02', 74, 13);
INSERT INTO public.chat_relations VALUES (108, false, '2025-08-19 18:41:49.423879+02', '2025-08-19 18:41:49.423879+02', 75, 12);
INSERT INTO public.chat_relations VALUES (109, false, '2025-08-19 18:42:48.094871+02', '2025-08-19 18:42:48.094871+02', 76, 12);
INSERT INTO public.chat_relations VALUES (110, false, '2025-08-19 18:42:48.096169+02', '2025-08-19 18:42:48.096169+02', 76, 14);
INSERT INTO public.chat_relations VALUES (111, false, '2025-08-19 18:43:03.046362+02', '2025-08-19 18:43:03.046362+02', 77, 12);
INSERT INTO public.chat_relations VALUES (112, false, '2025-08-19 18:43:03.046763+02', '2025-08-19 18:43:03.046763+02', 77, 13);
INSERT INTO public.chat_relations VALUES (113, false, '2025-08-19 18:43:38.814792+02', '2025-08-19 18:43:38.814792+02', 78, 13);
INSERT INTO public.chat_relations VALUES (114, false, '2025-08-19 18:43:38.81686+02', '2025-08-19 18:43:38.81686+02', 79, 12);
INSERT INTO public.chat_relations VALUES (115, false, '2025-08-19 18:43:43.527837+02', '2025-08-19 18:43:43.527837+02', 80, 14);
INSERT INTO public.chat_relations VALUES (116, false, '2025-08-19 18:43:43.529448+02', '2025-08-19 18:43:43.529448+02', 81, 12);
INSERT INTO public.chat_relations VALUES (117, false, '2025-08-19 18:44:14.480145+02', '2025-08-19 18:44:14.480145+02', 82, 12);
INSERT INTO public.chat_relations VALUES (118, false, '2025-08-19 18:44:14.480534+02', '2025-08-19 18:44:14.480534+02', 82, 14);
INSERT INTO public.chat_relations VALUES (121, false, '2025-08-19 18:45:32.087394+02', '2025-08-19 18:45:32.087394+02', 84, 13);
INSERT INTO public.chat_relations VALUES (122, false, '2025-08-19 18:45:32.089863+02', '2025-08-19 18:45:32.089863+02', 85, 12);
INSERT INTO public.chat_relations VALUES (123, false, '2025-08-19 19:05:49.966286+02', '2025-08-19 19:05:49.966286+02', 86, 12);
INSERT INTO public.chat_relations VALUES (124, false, '2025-08-19 19:05:49.966627+02', '2025-08-19 19:05:49.966627+02', 86, 13);
INSERT INTO public.chat_relations VALUES (125, false, '2025-08-19 19:06:07.672437+02', '2025-08-19 19:06:07.672437+02', 87, 12);
INSERT INTO public.chat_relations VALUES (126, false, '2025-08-19 19:06:07.672829+02', '2025-08-19 19:06:07.672829+02', 87, 14);
INSERT INTO public.chat_relations VALUES (127, false, '2025-08-19 19:09:33.928049+02', '2025-08-19 19:09:33.928049+02', 88, 12);
INSERT INTO public.chat_relations VALUES (128, false, '2025-08-19 19:09:33.928381+02', '2025-08-19 19:09:33.928381+02', 88, 13);
INSERT INTO public.chat_relations VALUES (129, false, '2025-08-19 19:09:45.074644+02', '2025-08-19 19:09:45.074644+02', 89, 12);
INSERT INTO public.chat_relations VALUES (130, false, '2025-08-19 19:09:45.075116+02', '2025-08-19 19:09:45.075116+02', 89, 14);
INSERT INTO public.chat_relations VALUES (131, false, '2025-08-19 19:15:36.934875+02', '2025-08-19 19:15:36.934875+02', 90, 10);
INSERT INTO public.chat_relations VALUES (132, false, '2025-08-19 19:15:36.93537+02', '2025-08-19 19:15:36.93537+02', 90, 13);
INSERT INTO public.chat_relations VALUES (133, false, '2025-08-19 19:16:27.639865+02', '2025-08-19 19:16:27.639865+02', 91, 10);
INSERT INTO public.chat_relations VALUES (134, false, '2025-08-19 19:16:27.640385+02', '2025-08-19 19:16:27.640385+02', 91, 14);
INSERT INTO public.chat_relations VALUES (135, false, '2025-08-19 19:17:07.719256+02', '2025-08-19 19:17:07.719256+02', 92, 13);
INSERT INTO public.chat_relations VALUES (136, false, '2025-08-19 19:17:07.721457+02', '2025-08-19 19:17:07.721457+02', 93, 10);
INSERT INTO public.chat_relations VALUES (137, false, '2025-08-19 19:18:02.554341+02', '2025-08-19 19:18:02.554341+02', 94, 14);
INSERT INTO public.chat_relations VALUES (138, false, '2025-08-19 19:18:02.557814+02', '2025-08-19 19:18:02.557814+02', 95, 10);
INSERT INTO public.chat_relations VALUES (139, false, '2025-08-19 19:18:57.054019+02', '2025-08-19 19:18:57.054019+02', 96, 10);
INSERT INTO public.chat_relations VALUES (140, false, '2025-08-19 19:18:57.054349+02', '2025-08-19 19:18:57.054349+02', 96, 14);
INSERT INTO public.chat_relations VALUES (141, false, '2025-08-19 19:20:01.366033+02', '2025-08-19 19:20:01.366033+02', 97, 14);
INSERT INTO public.chat_relations VALUES (142, false, '2025-08-19 19:20:01.369525+02', '2025-08-19 19:20:01.369525+02', 98, 10);
INSERT INTO public.chat_relations VALUES (143, false, '2025-08-19 19:20:56.623398+02', '2025-08-19 19:20:56.623398+02', 99, 10);
INSERT INTO public.chat_relations VALUES (144, false, '2025-08-19 19:20:56.62449+02', '2025-08-19 19:20:56.62449+02', 99, 14);
INSERT INTO public.chat_relations VALUES (155, false, '2025-08-19 19:33:47.942158+02', '2025-08-19 19:33:47.942158+02', 106, 14);
INSERT INTO public.chat_relations VALUES (156, false, '2025-08-19 19:33:47.945441+02', '2025-08-19 19:33:47.945441+02', 107, 6);
INSERT INTO public.chat_relations VALUES (157, false, '2025-08-19 19:38:06.533616+02', '2025-08-19 19:38:06.533616+02', 108, 6);
INSERT INTO public.chat_relations VALUES (158, false, '2025-08-19 19:38:06.534991+02', '2025-08-19 19:38:06.534991+02', 108, 13);
INSERT INTO public.chat_relations VALUES (159, false, '2025-08-19 19:38:19.501932+02', '2025-08-19 19:38:19.501932+02', 109, 6);
INSERT INTO public.chat_relations VALUES (160, false, '2025-08-19 19:38:19.502475+02', '2025-08-19 19:38:19.502475+02', 109, 1);
INSERT INTO public.chat_relations VALUES (145, false, '2025-08-19 19:30:22.675693+02', '2025-08-19 19:30:22.675693+02', 100, 6);
INSERT INTO public.chat_relations VALUES (146, false, '2025-08-19 19:30:22.677959+02', '2025-08-19 19:30:22.677959+02', 100, 13);
INSERT INTO public.chat_relations VALUES (147, false, '2025-08-19 19:30:32.07468+02', '2025-08-19 19:30:32.07468+02', 101, 6);
INSERT INTO public.chat_relations VALUES (148, false, '2025-08-19 19:30:32.075876+02', '2025-08-19 19:30:32.075876+02', 101, 14);
INSERT INTO public.chat_relations VALUES (149, false, '2025-08-19 19:32:05.441055+02', '2025-08-19 19:32:05.441055+02', 102, 13);
INSERT INTO public.chat_relations VALUES (150, false, '2025-08-19 19:32:05.443247+02', '2025-08-19 19:32:05.443247+02', 103, 6);
INSERT INTO public.chat_relations VALUES (151, false, '2025-08-19 19:32:49.56135+02', '2025-08-19 19:32:49.56135+02', 104, 6);
INSERT INTO public.chat_relations VALUES (152, false, '2025-08-19 19:32:49.561995+02', '2025-08-19 19:32:49.561995+02', 104, 13);
INSERT INTO public.chat_relations VALUES (153, false, '2025-08-19 19:33:00.705824+02', '2025-08-19 19:33:00.705824+02', 105, 6);
INSERT INTO public.chat_relations VALUES (154, false, '2025-08-19 19:33:00.706283+02', '2025-08-19 19:33:00.706283+02', 105, 14);
INSERT INTO public.chat_relations VALUES (161, false, '2025-08-19 19:40:10.859703+02', '2025-08-19 19:40:10.859703+02', 110, 13);
INSERT INTO public.chat_relations VALUES (162, false, '2025-08-19 19:40:10.862714+02', '2025-08-19 19:40:10.862714+02', 111, 6);


--
-- TOC entry 5215 (class 0 OID 962385)
-- Dependencies: 264
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.chats VALUES (1, 1, 'order', 'Rental Men''s low-top sneakers Puma Rebound v6 Low 39232843 44', '2025-08-10 12:44:29.62742+02', '2025-08-10 12:44:29.62742+02');
INSERT INTO public.chats VALUES (2, 2, 'order', 'Rental Leggings', '2025-08-18 17:31:01.412195+02', '2025-08-18 17:31:01.412195+02');
INSERT INTO public.chats VALUES (3, 3, 'order', 'Rental Footwear', '2025-08-18 18:28:45.49936+02', '2025-08-18 18:28:45.49936+02');
INSERT INTO public.chats VALUES (4, 4, 'order', 'Rental Footwear', '2025-08-18 18:36:30.012347+02', '2025-08-18 18:36:30.012347+02');
INSERT INTO public.chats VALUES (5, 1, 'dispute', 'Dispute for order #4', '2025-08-18 18:37:30.163738+02', '2025-08-18 18:37:30.163738+02');
INSERT INTO public.chats VALUES (6, 1, 'dispute', 'Dispute for order #4', '2025-08-18 18:37:30.170266+02', '2025-08-18 18:37:30.170266+02');
INSERT INTO public.chats VALUES (7, 5, 'order', 'Rental Bracelet', '2025-08-18 18:39:23.352781+02', '2025-08-18 18:39:23.352781+02');
INSERT INTO public.chats VALUES (8, 2, 'dispute', 'Dispute for order #5', '2025-08-18 18:40:26.424929+02', '2025-08-18 18:40:26.424929+02');
INSERT INTO public.chats VALUES (9, 2, 'dispute', 'Dispute for order #5', '2025-08-18 18:40:26.432195+02', '2025-08-18 18:40:26.432195+02');
INSERT INTO public.chats VALUES (10, 6, 'order', 'Rental Sweater', '2025-08-18 18:43:31.11073+02', '2025-08-18 18:43:31.11073+02');
INSERT INTO public.chats VALUES (11, 7, 'order', 'Rental Ring', '2025-08-18 18:53:53.253729+02', '2025-08-18 18:53:53.253729+02');
INSERT INTO public.chats VALUES (12, 3, 'dispute', 'Dispute for order #7', '2025-08-18 18:56:54.165888+02', '2025-08-18 18:56:54.165888+02');
INSERT INTO public.chats VALUES (13, 3, 'dispute', 'Dispute for order #7', '2025-08-18 18:56:54.172481+02', '2025-08-18 18:56:54.172481+02');
INSERT INTO public.chats VALUES (14, 8, 'order', 'Rental Tracksuit', '2025-08-18 19:06:52.831586+02', '2025-08-18 19:06:52.831586+02');
INSERT INTO public.chats VALUES (15, 9, 'order', 'Rental Tracksuit', '2025-08-18 19:08:47.603217+02', '2025-08-18 19:08:47.603217+02');
INSERT INTO public.chats VALUES (16, 4, 'dispute', 'Dispute for order #9', '2025-08-18 19:10:04.724865+02', '2025-08-18 19:10:04.724865+02');
INSERT INTO public.chats VALUES (17, 4, 'dispute', 'Dispute for order #9', '2025-08-18 19:10:04.731854+02', '2025-08-18 19:10:04.731854+02');
INSERT INTO public.chats VALUES (18, 10, 'order', 'Rental Bracelet', '2025-08-18 19:11:21.048231+02', '2025-08-18 19:11:21.048231+02');
INSERT INTO public.chats VALUES (19, 5, 'dispute', 'Dispute for order #10', '2025-08-18 19:12:52.433974+02', '2025-08-18 19:12:52.433974+02');
INSERT INTO public.chats VALUES (20, 5, 'dispute', 'Dispute for order #10', '2025-08-18 19:12:52.44132+02', '2025-08-18 19:12:52.44132+02');
INSERT INTO public.chats VALUES (21, 11, 'order', 'Rental Handbag', '2025-08-18 19:13:42.438671+02', '2025-08-18 19:13:42.438671+02');
INSERT INTO public.chats VALUES (22, 6, 'dispute', 'Dispute for order #11', '2025-08-18 19:14:31.473853+02', '2025-08-18 19:14:31.473853+02');
INSERT INTO public.chats VALUES (23, 6, 'dispute', 'Dispute for order #11', '2025-08-18 19:14:31.479675+02', '2025-08-18 19:14:31.479675+02');
INSERT INTO public.chats VALUES (24, 12, 'order', 'Rental Bracelet', '2025-08-18 19:14:52.502236+02', '2025-08-18 19:14:52.502236+02');
INSERT INTO public.chats VALUES (25, 7, 'dispute', 'Dispute for order #12', '2025-08-18 19:17:28.591361+02', '2025-08-18 19:17:28.591361+02');
INSERT INTO public.chats VALUES (26, 7, 'dispute', 'Dispute for order #12', '2025-08-18 19:17:28.597833+02', '2025-08-18 19:17:28.597833+02');
INSERT INTO public.chats VALUES (27, 13, 'order', 'Rental Bracelet', '2025-08-18 19:26:31.74313+02', '2025-08-18 19:26:31.74313+02');
INSERT INTO public.chats VALUES (28, 8, 'dispute', 'Dispute for order #13', '2025-08-18 19:27:29.619317+02', '2025-08-18 19:27:29.619317+02');
INSERT INTO public.chats VALUES (29, 8, 'dispute', 'Dispute for order #13', '2025-08-18 19:27:29.625337+02', '2025-08-18 19:27:29.625337+02');
INSERT INTO public.chats VALUES (30, 14, 'order', 'Rental Bracelet', '2025-08-19 17:29:11.260063+02', '2025-08-19 17:29:11.260063+02');
INSERT INTO public.chats VALUES (31, 9, 'dispute', 'Dispute for order #14', '2025-08-19 17:32:44.652321+02', '2025-08-19 17:32:44.652321+02');
INSERT INTO public.chats VALUES (32, 9, 'dispute', 'Dispute for order #14', '2025-08-19 17:32:44.660242+02', '2025-08-19 17:32:44.660242+02');
INSERT INTO public.chats VALUES (33, 15, 'order', 'Rental Bracelet', '2025-08-19 17:34:56.78199+02', '2025-08-19 17:34:56.78199+02');
INSERT INTO public.chats VALUES (34, 10, 'dispute', 'Dispute for order #15', '2025-08-19 17:41:24.748793+02', '2025-08-19 17:41:24.748793+02');
INSERT INTO public.chats VALUES (35, 10, 'dispute', 'Dispute for order #15', '2025-08-19 17:41:24.75596+02', '2025-08-19 17:41:24.75596+02');
INSERT INTO public.chats VALUES (36, 16, 'order', 'Rental Handbag', '2025-08-19 17:45:21.31106+02', '2025-08-19 17:45:21.31106+02');
INSERT INTO public.chats VALUES (37, 17, 'order', 'Rental T-shirt', '2025-08-19 17:49:16.364994+02', '2025-08-19 17:49:16.364994+02');
INSERT INTO public.chats VALUES (38, 18, 'order', 'Rental Shirt', '2025-08-19 17:52:24.255179+02', '2025-08-19 17:52:24.255179+02');
INSERT INTO public.chats VALUES (39, 11, 'dispute', 'Dispute for order #18', '2025-08-19 17:53:45.801211+02', '2025-08-19 17:53:45.801211+02');
INSERT INTO public.chats VALUES (40, 11, 'dispute', 'Dispute for order #18', '2025-08-19 17:53:45.804402+02', '2025-08-19 17:53:45.804402+02');
INSERT INTO public.chats VALUES (41, 19, 'order', 'Rental Sunglasses', '2025-08-19 18:00:59.649044+02', '2025-08-19 18:00:59.649044+02');
INSERT INTO public.chats VALUES (42, 12, 'dispute', 'Dispute for order #19', '2025-08-19 18:01:38.033953+02', '2025-08-19 18:01:38.033953+02');
INSERT INTO public.chats VALUES (43, 12, 'dispute', 'Dispute for order #19', '2025-08-19 18:01:38.038463+02', '2025-08-19 18:01:38.038463+02');
INSERT INTO public.chats VALUES (44, 20, 'order', 'Rental Sunglasses', '2025-08-19 18:02:16.144085+02', '2025-08-19 18:02:16.144085+02');
INSERT INTO public.chats VALUES (45, 13, 'dispute', 'Dispute for order #20', '2025-08-19 18:03:29.364804+02', '2025-08-19 18:03:29.364804+02');
INSERT INTO public.chats VALUES (46, 13, 'dispute', 'Dispute for order #20', '2025-08-19 18:03:29.368751+02', '2025-08-19 18:03:29.368751+02');
INSERT INTO public.chats VALUES (47, 21, 'order', 'Rental Jacket', '2025-08-19 18:04:10.711667+02', '2025-08-19 18:04:10.711667+02');
INSERT INTO public.chats VALUES (48, 14, 'dispute', 'Dispute for order #21', '2025-08-19 18:05:14.058141+02', '2025-08-19 18:05:14.058141+02');
INSERT INTO public.chats VALUES (49, 14, 'dispute', 'Dispute for order #21', '2025-08-19 18:05:14.060541+02', '2025-08-19 18:05:14.060541+02');
INSERT INTO public.chats VALUES (50, 22, 'order', 'Rental Ankle boots', '2025-08-19 18:05:34.848784+02', '2025-08-19 18:05:34.848784+02');
INSERT INTO public.chats VALUES (51, 15, 'dispute', 'Dispute for order #22', '2025-08-19 18:06:29.242579+02', '2025-08-19 18:06:29.242579+02');
INSERT INTO public.chats VALUES (52, 15, 'dispute', 'Dispute for order #22', '2025-08-19 18:06:29.245204+02', '2025-08-19 18:06:29.245204+02');
INSERT INTO public.chats VALUES (53, 23, 'order', 'Rental Blouse', '2025-08-19 18:10:56.032304+02', '2025-08-19 18:10:56.032304+02');
INSERT INTO public.chats VALUES (54, 24, 'order', 'Rental Sweatshirt', '2025-08-19 18:15:20.679803+02', '2025-08-19 18:15:20.679803+02');
INSERT INTO public.chats VALUES (55, 25, 'order', 'Rental Sweatshirt', '2025-08-19 18:15:33.492435+02', '2025-08-19 18:15:33.492435+02');
INSERT INTO public.chats VALUES (56, 16, 'dispute', 'Dispute for order #25', '2025-08-19 18:16:51.596025+02', '2025-08-19 18:16:51.596025+02');
INSERT INTO public.chats VALUES (57, 16, 'dispute', 'Dispute for order #25', '2025-08-19 18:16:51.598405+02', '2025-08-19 18:16:51.598405+02');
INSERT INTO public.chats VALUES (58, 26, 'order', 'Rental Tracksuit', '2025-08-19 18:26:42.273292+02', '2025-08-19 18:26:42.273292+02');
INSERT INTO public.chats VALUES (59, 27, 'order', 'Rental Cap', '2025-08-19 18:30:12.068555+02', '2025-08-19 18:30:12.068555+02');
INSERT INTO public.chats VALUES (60, 28, 'order', 'Rental Leggings', '2025-08-19 18:31:00.335988+02', '2025-08-19 18:31:00.335988+02');
INSERT INTO public.chats VALUES (61, 29, 'order', 'Rental Onesie', '2025-08-19 18:32:14.478864+02', '2025-08-19 18:32:14.478864+02');
INSERT INTO public.chats VALUES (62, 17, 'dispute', 'Dispute for order #29', '2025-08-19 18:33:07.255277+02', '2025-08-19 18:33:07.255277+02');
INSERT INTO public.chats VALUES (63, 17, 'dispute', 'Dispute for order #29', '2025-08-19 18:33:07.257632+02', '2025-08-19 18:33:07.257632+02');
INSERT INTO public.chats VALUES (64, 30, 'order', 'Rental Onesie', '2025-08-19 18:33:27.643812+02', '2025-08-19 18:33:27.643812+02');
INSERT INTO public.chats VALUES (65, 18, 'dispute', 'Dispute for order #30', '2025-08-19 18:34:19.252987+02', '2025-08-19 18:34:19.252987+02');
INSERT INTO public.chats VALUES (66, 18, 'dispute', 'Dispute for order #30', '2025-08-19 18:34:19.256391+02', '2025-08-19 18:34:19.256391+02');
INSERT INTO public.chats VALUES (67, 31, 'order', 'Rental Onesie', '2025-08-19 18:34:39.221328+02', '2025-08-19 18:34:39.221328+02');
INSERT INTO public.chats VALUES (68, 19, 'dispute', 'Dispute for order #31', '2025-08-19 18:35:55.161901+02', '2025-08-19 18:35:55.161901+02');
INSERT INTO public.chats VALUES (69, 19, 'dispute', 'Dispute for order #31', '2025-08-19 18:35:55.164723+02', '2025-08-19 18:35:55.164723+02');
INSERT INTO public.chats VALUES (70, 32, 'order', 'Rental Flip flops', '2025-08-19 18:40:33.002969+02', '2025-08-19 18:40:33.002969+02');
INSERT INTO public.chats VALUES (71, 33, 'order', 'Rental Flip flops', '2025-08-19 18:40:40.279633+02', '2025-08-19 18:40:40.279633+02');
INSERT INTO public.chats VALUES (72, 20, 'dispute', 'Dispute for order #32', '2025-08-19 18:41:34.53654+02', '2025-08-19 18:41:34.53654+02');
INSERT INTO public.chats VALUES (73, 20, 'dispute', 'Dispute for order #32', '2025-08-19 18:41:34.538435+02', '2025-08-19 18:41:34.538435+02');
INSERT INTO public.chats VALUES (74, 21, 'dispute', 'Dispute for order #33', '2025-08-19 18:41:49.421125+02', '2025-08-19 18:41:49.421125+02');
INSERT INTO public.chats VALUES (75, 21, 'dispute', 'Dispute for order #33', '2025-08-19 18:41:49.423446+02', '2025-08-19 18:41:49.423446+02');
INSERT INTO public.chats VALUES (76, 34, 'order', 'Rental Flip flops', '2025-08-19 18:42:48.09343+02', '2025-08-19 18:42:48.09343+02');
INSERT INTO public.chats VALUES (77, 35, 'order', 'Rental Flip flops', '2025-08-19 18:43:03.045611+02', '2025-08-19 18:43:03.045611+02');
INSERT INTO public.chats VALUES (78, 22, 'dispute', 'Dispute for order #35', '2025-08-19 18:43:38.814436+02', '2025-08-19 18:43:38.814436+02');
INSERT INTO public.chats VALUES (79, 22, 'dispute', 'Dispute for order #35', '2025-08-19 18:43:38.816455+02', '2025-08-19 18:43:38.816455+02');
INSERT INTO public.chats VALUES (80, 23, 'dispute', 'Dispute for order #34', '2025-08-19 18:43:43.52747+02', '2025-08-19 18:43:43.52747+02');
INSERT INTO public.chats VALUES (81, 23, 'dispute', 'Dispute for order #34', '2025-08-19 18:43:43.529229+02', '2025-08-19 18:43:43.529229+02');
INSERT INTO public.chats VALUES (82, 36, 'order', 'Rental Flip flops', '2025-08-19 18:44:14.47942+02', '2025-08-19 18:44:14.47942+02');
INSERT INTO public.chats VALUES (83, 37, 'order', 'Rental Flip flops', '2025-08-19 18:44:20.441208+02', '2025-08-19 18:44:20.441208+02');
INSERT INTO public.chats VALUES (84, 24, 'dispute', 'Dispute for order #37', '2025-08-19 18:45:32.087006+02', '2025-08-19 18:45:32.087006+02');
INSERT INTO public.chats VALUES (85, 24, 'dispute', 'Dispute for order #37', '2025-08-19 18:45:32.089465+02', '2025-08-19 18:45:32.089465+02');
INSERT INTO public.chats VALUES (86, 38, 'order', 'Rental Tracksuit', '2025-08-19 19:05:49.965925+02', '2025-08-19 19:05:49.965925+02');
INSERT INTO public.chats VALUES (87, 39, 'order', 'Rental Leggings', '2025-08-19 19:06:07.671918+02', '2025-08-19 19:06:07.671918+02');
INSERT INTO public.chats VALUES (88, 40, 'order', 'Rental Leggings', '2025-08-19 19:09:33.927588+02', '2025-08-19 19:09:33.927588+02');
INSERT INTO public.chats VALUES (89, 41, 'order', 'Rental Leggings', '2025-08-19 19:09:45.074114+02', '2025-08-19 19:09:45.074114+02');
INSERT INTO public.chats VALUES (90, 42, 'order', 'Rental Sunglasses', '2025-08-19 19:15:36.934033+02', '2025-08-19 19:15:36.934033+02');
INSERT INTO public.chats VALUES (91, 43, 'order', 'Rental Toddler Girl Dresses', '2025-08-19 19:16:27.639276+02', '2025-08-19 19:16:27.639276+02');
INSERT INTO public.chats VALUES (92, 25, 'dispute', 'Dispute for order #42', '2025-08-19 19:17:07.718644+02', '2025-08-19 19:17:07.718644+02');
INSERT INTO public.chats VALUES (93, 25, 'dispute', 'Dispute for order #42', '2025-08-19 19:17:07.721101+02', '2025-08-19 19:17:07.721101+02');
INSERT INTO public.chats VALUES (94, 26, 'dispute', 'Dispute for order #43', '2025-08-19 19:18:02.553969+02', '2025-08-19 19:18:02.553969+02');
INSERT INTO public.chats VALUES (95, 26, 'dispute', 'Dispute for order #43', '2025-08-19 19:18:02.557502+02', '2025-08-19 19:18:02.557502+02');
INSERT INTO public.chats VALUES (96, 44, 'order', 'Rental Blouse', '2025-08-19 19:18:57.053315+02', '2025-08-19 19:18:57.053315+02');
INSERT INTO public.chats VALUES (97, 27, 'dispute', 'Dispute for order #44', '2025-08-19 19:20:01.365677+02', '2025-08-19 19:20:01.365677+02');
INSERT INTO public.chats VALUES (98, 27, 'dispute', 'Dispute for order #44', '2025-08-19 19:20:01.369217+02', '2025-08-19 19:20:01.369217+02');
INSERT INTO public.chats VALUES (99, 45, 'order', 'Rental Ankle boots', '2025-08-19 19:20:56.622689+02', '2025-08-19 19:20:56.622689+02');
INSERT INTO public.chats VALUES (100, 46, 'order', 'Rental Ring', '2025-08-19 19:30:22.674876+02', '2025-08-19 19:30:22.674876+02');
INSERT INTO public.chats VALUES (101, 47, 'order', 'Rental Ring', '2025-08-19 19:30:32.073287+02', '2025-08-19 19:30:32.073287+02');
INSERT INTO public.chats VALUES (102, 28, 'dispute', 'Dispute for order #46', '2025-08-19 19:32:05.440584+02', '2025-08-19 19:32:05.440584+02');
INSERT INTO public.chats VALUES (103, 28, 'dispute', 'Dispute for order #46', '2025-08-19 19:32:05.442977+02', '2025-08-19 19:32:05.442977+02');
INSERT INTO public.chats VALUES (104, 48, 'order', 'Rental Ring', '2025-08-19 19:32:49.560714+02', '2025-08-19 19:32:49.560714+02');
INSERT INTO public.chats VALUES (105, 49, 'order', 'Rental Ring', '2025-08-19 19:33:00.705301+02', '2025-08-19 19:33:00.705301+02');
INSERT INTO public.chats VALUES (106, 29, 'dispute', 'Dispute for order #49', '2025-08-19 19:33:47.940657+02', '2025-08-19 19:33:47.940657+02');
INSERT INTO public.chats VALUES (107, 29, 'dispute', 'Dispute for order #49', '2025-08-19 19:33:47.945131+02', '2025-08-19 19:33:47.945131+02');
INSERT INTO public.chats VALUES (108, 50, 'order', 'Rental Sweater', '2025-08-19 19:38:06.532226+02', '2025-08-19 19:38:06.532226+02');
INSERT INTO public.chats VALUES (109, 51, 'order', 'Rental Sweater', '2025-08-19 19:38:19.50115+02', '2025-08-19 19:38:19.50115+02');
INSERT INTO public.chats VALUES (110, 30, 'dispute', 'Dispute for order #50', '2025-08-19 19:40:10.857542+02', '2025-08-19 19:40:10.857542+02');
INSERT INTO public.chats VALUES (111, 30, 'dispute', 'Dispute for order #50', '2025-08-19 19:40:10.862292+02', '2025-08-19 19:40:10.862292+02');


--
-- TOC entry 5231 (class 0 OID 962525)
-- Dependencies: 280
-- Data for Name: dispute_prediction_models; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.dispute_prediction_models VALUES (6, 0, false, false, true, false, false, false, '[{"pseudonym":"123213","type":"field","content":{"tableName":"orders","fieldName":"status","joins":[]},"comparisonType":"numerical"},{"pseudonym":"renter_average_rating","type":"template","content":[{"key":"avg","body":"Avg","subItems":[{"key":"table_selects","body":"Table Selects","content":{"tableName":"rc1","fieldName":"care","joins":[{"baseTable":"orders","baseField":"id","joinedTable":"renter_comments","joinedField":"order_id","pseudonym":"rc1"}],"pseudonym":"rc_avg_care"},"id":"776f59c3fbea02075efc574e120a696d018166e6"},{"key":"+","body":"+","id":"operation-test"},{"key":"table_selects","body":"Table Selects","content":{"tableName":"rc1","fieldName":"timeliness","joins":[{"baseTable":"orders","baseField":"id","joinedTable":"renter_comments","joinedField":"order_id","pseudonym":"rc1"}],"pseudonym":"rc_avg_timeliness"},"id":"d503aefce2ef50746766738305f90d092cd0cc5b"}],"id":"dab907ba98848fceee44111cb4b4a6a3e767c09f"}],"conditions":[{"baseTable":"rc1","baseField":"order_id","joinCondition":"=","joinedTable":"orders","joinedField":"id"}],"orders":[],"groups":[{"baseTable":"rc1","baseField":"care"}],"comparisonType":"numerical"}]', '2025-07-15 21:24:10.017427+02', '2025-07-15 21:24:10.017427+02', false, NULL, 0, NULL, NULL, 0);
INSERT INTO public.dispute_prediction_models VALUES (3, 0, false, true, true, false, false, false, '[{"pseudonym":"123213","type":"field","content":{"tableName":"orders","fieldName":"status","joins":[]},"comparisonType":"numerical"},{"pseudonym":"renter_average_rating","type":"template","content":[{"key":"avg","body":"Avg","subItems":[{"key":"table_selects","body":"Table Selects","content":{"tableName":"rc1","fieldName":"care","joins":[{"baseTable":"orders","baseField":"id","joinedTable":"renter_comments","joinedField":"order_id","pseudonym":"rc1"}],"pseudonym":"rc_avg_care"},"id":"776f59c3fbea02075efc574e120a696d018166e6"},{"key":"table_selects","body":"Table Selects","content":{"tableName":"rc1","fieldName":"timeliness","joins":[{"baseTable":"orders","baseField":"id","joinedTable":"renter_comments","joinedField":"order_id","pseudonym":"rc1"}],"pseudonym":"rc_avg_timeliness"},"id":"d503aefce2ef50746766738305f90d092cd0cc5b"}],"id":"dab907ba98848fceee44111cb4b4a6a3e767c09f"}],"conditions":[{"baseTable":"rc1","baseField":"order_id","joinCondition":"=","joinedTable":"orders","joinedField":"id"}],"orders":[],"groups":[{"baseTable":"rc1","baseField":"care"}],"comparisonType":"numerical"}]', '2025-07-15 21:22:06.877799+02', '2025-07-15 21:22:06.877799+02', false, NULL, 0, NULL, NULL, 0);
INSERT INTO public.dispute_prediction_models VALUES (1, 0, false, true, true, false, false, false, '[{"pseudonym":"12312","type":"field","content":{"tableName":"orders","fieldName":"status","joins":[]}}]', '2025-07-15 21:20:58.857395+02', '2025-07-15 21:20:58.857395+02', false, NULL, 0, NULL, NULL, 0);
INSERT INTO public.dispute_prediction_models VALUES (2, 0, false, true, true, false, false, false, '[{"pseudonym":"12312","type":"field","content":{"tableName":"orders","fieldName":"status","joins":[]}}]', '2025-07-15 21:21:18.291905+02', '2025-07-15 21:21:18.291905+02', false, NULL, 0, NULL, NULL, 0);
INSERT INTO public.dispute_prediction_models VALUES (5, 0, false, true, true, false, false, false, '[{"pseudonym":"123213","type":"field","content":{"tableName":"orders","fieldName":"cancel_status","joins":[]}}]', '2025-07-15 21:23:55.493543+02', '2025-07-15 21:23:55.493543+02', false, NULL, 0, NULL, NULL, 0);
INSERT INTO public.dispute_prediction_models VALUES (4, 0, false, false, false, false, false, false, '[{"pseudonym":"123","type":"field","content":{"tableName":"orders","fieldName":"id","joins":[]}}]', '2025-07-15 21:23:31.118616+02', '2025-07-15 21:23:31.118616+02', false, NULL, 0, NULL, NULL, 0);
INSERT INTO public.dispute_prediction_models VALUES (7, 0, true, false, true, false, false, false, '[{"pseudonym":"order_status","type":"field","content":{"tableName":"orders","fieldName":"status","joins":[]},"comparisonType":"numerical"},{"pseudonym":"renter_average_rating","type":"template","content":[{"key":"avg","body":"Avg","subItems":[{"key":"table_selects","body":"Table Selects","content":{"tableName":"rc1","fieldName":"care","joins":[{"baseTable":"orders","baseField":"id","joinedTable":"renter_comments","joinedField":"order_id","pseudonym":"rc1"}],"pseudonym":"rc_avg_care"},"id":"776f59c3fbea02075efc574e120a696d018166e6"},{"key":"+","body":"+","id":"operation-test"},{"key":"table_selects","body":"Table Selects","content":{"tableName":"rc1","fieldName":"timeliness","joins":[{"baseTable":"orders","baseField":"id","joinedTable":"renter_comments","joinedField":"order_id","pseudonym":"rc1"}],"pseudonym":"rc_avg_timeliness"},"id":"d503aefce2ef50746766738305f90d092cd0cc5b"}],"id":"dab907ba98848fceee44111cb4b4a6a3e767c09f"}],"conditions":[{"baseTable":"rc1","baseField":"order_id","joinCondition":"=","joinedTable":"orders","joinedField":"id"}],"orders":[],"groups":[{"baseTable":"rc1","baseField":"care"}],"comparisonType":"numerical"}]', '2025-08-08 20:18:54.411083+02', '2025-08-08 20:18:54.411083+02', false, 'renter_average_rating', 0, NULL, '["order_status", "renter_average_rating"]', 0);


--
-- TOC entry 5213 (class 0 OID 962362)
-- Dependencies: 262
-- Data for Name: disputes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.disputes VALUES (1, '', 'bad attitude', 'communication', 'open', NULL, '2025-08-18 18:37:30.154897+02', '2025-08-18 18:37:30.154897+02', 4, 4);
INSERT INTO public.disputes VALUES (2, '', 'changed the decoration', 'damage', 'open', NULL, '2025-08-18 18:40:26.422208+02', '2025-08-18 18:40:26.422208+02', 5, 3);
INSERT INTO public.disputes VALUES (3, '', 'bad', 'problems-with-withdrawal', 'open', NULL, '2025-08-18 18:56:54.163258+02', '2025-08-18 18:56:54.163258+02', 7, 6);
INSERT INTO public.disputes VALUES (4, '', '???', 'payment', 'open', NULL, '2025-08-18 19:10:04.721257+02', '2025-08-18 19:10:04.721257+02', 9, 4);
INSERT INTO public.disputes VALUES (5, '', 'incorrect information', 'payment', 'open', NULL, '2025-08-18 19:12:52.431949+02', '2025-08-18 19:12:52.431949+02', 10, 3);
INSERT INTO public.disputes VALUES (6, '', '????', 'others', 'open', NULL, '2025-08-18 19:14:31.471404+02', '2025-08-18 19:14:31.471404+02', 11, 4);
INSERT INTO public.disputes VALUES (7, '', '???', 'damage', 'open', NULL, '2025-08-18 19:17:28.586565+02', '2025-08-18 19:17:28.586565+02', 12, 3);
INSERT INTO public.disputes VALUES (8, '', 'false', 'damage', 'open', NULL, '2025-08-18 19:27:29.616559+02', '2025-08-18 19:27:29.616559+02', 13, 3);
INSERT INTO public.disputes VALUES (9, '', '???', 'problems-with-withdrawal', 'open', NULL, '2025-08-19 17:32:44.648836+02', '2025-08-19 17:32:44.648836+02', 14, 5);
INSERT INTO public.disputes VALUES (10, '', 'done fail', 'damage', 'open', NULL, '2025-08-19 17:41:24.745927+02', '2025-08-19 17:41:24.745927+02', 15, 3);
INSERT INTO public.disputes VALUES (11, '', '????', 'others', 'open', NULL, '2025-08-19 17:53:45.799192+02', '2025-08-19 17:53:45.799192+02', 18, 16);
INSERT INTO public.disputes VALUES (12, '', '???', 'damage', 'open', NULL, '2025-08-19 18:01:38.031754+02', '2025-08-19 18:01:38.031754+02', 19, 9);
INSERT INTO public.disputes VALUES (13, '', '???', 'damage', 'open', NULL, '2025-08-19 18:03:29.364001+02', '2025-08-19 18:03:29.364001+02', 20, 11);
INSERT INTO public.disputes VALUES (14, '', '???', 'payment', 'open', NULL, '2025-08-19 18:05:14.056126+02', '2025-08-19 18:05:14.056126+02', 21, 9);
INSERT INTO public.disputes VALUES (15, '', '???', 'damage', 'open', NULL, '2025-08-19 18:06:29.241964+02', '2025-08-19 18:06:29.241964+02', 22, 11);
INSERT INTO public.disputes VALUES (16, '', '???', 'damage', 'open', NULL, '2025-08-19 18:16:51.5922+02', '2025-08-19 18:16:51.5922+02', 25, 7);
INSERT INTO public.disputes VALUES (17, '', '???', 'damage', 'open', NULL, '2025-08-19 18:33:07.254693+02', '2025-08-19 18:33:07.254693+02', 29, 12);
INSERT INTO public.disputes VALUES (18, '', '???', 'damage', 'open', NULL, '2025-08-19 18:34:19.246901+02', '2025-08-19 18:34:19.246901+02', 30, 14);
INSERT INTO public.disputes VALUES (19, '', '???', 'damage', 'open', NULL, '2025-08-19 18:35:55.157111+02', '2025-08-19 18:35:55.157111+02', 31, 12);
INSERT INTO public.disputes VALUES (20, '', '???', 'damage', 'open', NULL, '2025-08-19 18:41:34.532129+02', '2025-08-19 18:41:34.532129+02', 32, 14);
INSERT INTO public.disputes VALUES (21, '', '??', 'damage', 'open', NULL, '2025-08-19 18:41:49.419602+02', '2025-08-19 18:41:49.419602+02', 33, 12);
INSERT INTO public.disputes VALUES (22, '', '???', 'damage', 'open', NULL, '2025-08-19 18:43:38.813903+02', '2025-08-19 18:43:38.813903+02', 35, 12);
INSERT INTO public.disputes VALUES (23, '', '???', 'damage', 'open', NULL, '2025-08-19 18:43:43.523169+02', '2025-08-19 18:43:43.523169+02', 34, 12);
INSERT INTO public.disputes VALUES (24, '', '??', 'damage', 'open', NULL, '2025-08-19 18:45:32.083303+02', '2025-08-19 18:45:32.083303+02', 37, 13);
INSERT INTO public.disputes VALUES (25, '', '???', 'damage', 'open', NULL, '2025-08-19 19:17:07.716722+02', '2025-08-19 19:17:07.716722+02', 42, 13);
INSERT INTO public.disputes VALUES (26, '', '?????', 'payment', 'open', NULL, '2025-08-19 19:18:02.54977+02', '2025-08-19 19:18:02.54977+02', 43, 10);
INSERT INTO public.disputes VALUES (27, '', '???', 'damage', 'open', NULL, '2025-08-19 19:20:01.361834+02', '2025-08-19 19:20:01.361834+02', 44, 10);
INSERT INTO public.disputes VALUES (28, '', '???', 'damage', 'open', NULL, '2025-08-19 19:32:05.439411+02', '2025-08-19 19:32:05.439411+02', 46, 6);
INSERT INTO public.disputes VALUES (29, '', '???', 'damage', 'open', NULL, '2025-08-19 19:33:47.936216+02', '2025-08-19 19:33:47.936216+02', 49, 6);
INSERT INTO public.disputes VALUES (30, '', '???', 'damage', 'open', NULL, '2025-08-19 19:40:10.855984+02', '2025-08-19 19:40:10.855984+02', 50, 6);


--
-- TOC entry 5173 (class 0 OID 962021)
-- Dependencies: 222
-- Data for Name: email_verified_codes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5167 (class 0 OID 961979)
-- Dependencies: 216
-- Data for Name: knex_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.knex_migrations VALUES (1, '20240125140450_create_users_tables.js', 1, '2025-07-13 13:52:02.33+02');
INSERT INTO public.knex_migrations VALUES (2, '20240202072243_create_email_verified_codes_tables.js', 1, '2025-07-13 13:52:02.338+02');
INSERT INTO public.knex_migrations VALUES (3, '20240202072243_create_phone_verified_codes_tables.js', 1, '2025-07-13 13:52:02.342+02');
INSERT INTO public.knex_migrations VALUES (4, '20240202072719_create_two_factor_auth_codes_tables.js', 1, '2025-07-13 13:52:02.347+02');
INSERT INTO public.knex_migrations VALUES (5, '20240202144510_create_seeds_status_table.js', 1, '2025-07-13 13:52:02.352+02');
INSERT INTO public.knex_migrations VALUES (6, '20240205124901_create_user_documents_tables.js', 1, '2025-07-13 13:52:02.357+02');
INSERT INTO public.knex_migrations VALUES (7, '20240205124908_create_logs_tables.js', 1, '2025-07-13 13:52:02.362+02');
INSERT INTO public.knex_migrations VALUES (8, '20240208140511_create_user_verify_requests_tables.js', 1, '2025-07-13 13:52:02.367+02');
INSERT INTO public.knex_migrations VALUES (9, '20240219145319_create_user_event_logs_tables.js', 1, '2025-07-13 13:52:02.374+02');
INSERT INTO public.knex_migrations VALUES (10, '20240219150119_create_system_tables.js', 1, '2025-07-13 13:52:02.379+02');
INSERT INTO public.knex_migrations VALUES (11, '20240226150923_create_listings_tables.js', 1, '2025-07-13 13:52:02.385+02');
INSERT INTO public.knex_migrations VALUES (12, '20240227070439_create_listing_categories_tables.js', 1, '2025-07-13 13:52:02.391+02');
INSERT INTO public.knex_migrations VALUES (13, '20240227071905_create_searched_words_tables.js', 1, '2025-07-13 13:52:02.395+02');
INSERT INTO public.knex_migrations VALUES (14, '20240227073948_create_listing_images_table.js', 1, '2025-07-13 13:52:02.401+02');
INSERT INTO public.knex_migrations VALUES (15, '20240307073946_create_listing_approve_requests_tables.js', 1, '2025-07-13 13:52:02.407+02');
INSERT INTO public.knex_migrations VALUES (16, '20240311125753_create_listing_category_create_notifications_tables.js', 1, '2025-07-13 13:52:02.413+02');
INSERT INTO public.knex_migrations VALUES (17, '20240416080654_create_orders_tables.js', 1, '2025-07-13 13:52:02.42+02');
INSERT INTO public.knex_migrations VALUES (18, '20240416083159_create_order_update_requests_tables.js', 1, '2025-07-13 13:52:02.425+02');
INSERT INTO public.knex_migrations VALUES (19, '20240501112244_create_sender_payments_tables.js', 1, '2025-07-13 13:52:02.431+02');
INSERT INTO public.knex_migrations VALUES (20, '20240501112253_create_recipient_payments_tables.js', 1, '2025-07-13 13:52:02.438+02');
INSERT INTO public.knex_migrations VALUES (21, '20240610125729_create_user_listing_favorites_tables.js', 1, '2025-07-13 13:52:02.444+02');
INSERT INTO public.knex_migrations VALUES (22, '20240611060653_create_disputes_tables.js', 1, '2025-07-13 13:52:02.452+02');
INSERT INTO public.knex_migrations VALUES (23, '20240618060957_create_chats_table.js', 1, '2025-07-13 13:52:02.457+02');
INSERT INTO public.knex_migrations VALUES (24, '20240618061013_create_chat_relations_table.js', 1, '2025-07-13 13:52:02.462+02');
INSERT INTO public.knex_migrations VALUES (25, '20240618061025_create_chat_messages_table.js', 1, '2025-07-13 13:52:02.467+02');
INSERT INTO public.knex_migrations VALUES (26, '20240618061036_create_chat_message_contents_table.js', 1, '2025-07-13 13:52:02.473+02');
INSERT INTO public.knex_migrations VALUES (27, '20240618074716_create_sockets_tables.js', 1, '2025-07-13 13:52:02.478+02');
INSERT INTO public.knex_migrations VALUES (28, '20240620185427_create_active_actions_tables.js', 1, '2025-07-13 13:52:02.483+02');
INSERT INTO public.knex_migrations VALUES (29, '20240724125605_create_renter_comments_tables.js', 1, '2025-07-13 13:52:02.488+02');
INSERT INTO public.knex_migrations VALUES (30, '20240724125612_create_owner_comments_tables.js', 1, '2025-07-13 13:52:02.493+02');
INSERT INTO public.knex_migrations VALUES (31, '20250724125612_create_dispute_prediction_models_tables.js', 2, '2025-07-15 20:46:35.005+02');
INSERT INTO public.knex_migrations VALUES (32, '20250725125612_update_dispute_prediction_models_tables.js', 3, '2025-07-22 19:17:13.38+02');
INSERT INTO public.knex_migrations VALUES (33, '20250726125612_update_dispute_prediction_models_tables.js', 4, '2025-08-08 17:47:41.882+02');
INSERT INTO public.knex_migrations VALUES (34, '20250726125731_update_orders_tables.js', 4, '2025-08-08 17:47:41.898+02');
INSERT INTO public.knex_migrations VALUES (35, '20250727080654_create_temp_orders_tables.js', 4, '2025-08-08 17:47:41.954+02');
INSERT INTO public.knex_migrations VALUES (36, '20250808125612_update_dispute_prediction_models_tables.js', 5, '2025-08-08 19:02:37.538+02');


--
-- TOC entry 5169 (class 0 OID 961986)
-- Dependencies: 218
-- Data for Name: knex_migrations_lock; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.knex_migrations_lock VALUES (1, 0);


--
-- TOC entry 5199 (class 0 OID 962221)
-- Dependencies: 248
-- Data for Name: listing_approval_requests; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.listing_approval_requests VALUES (1, NULL, true, '2025-08-10 11:55:33.481779+02', '2025-08-10 11:55:33.481779+02', 1);


--
-- TOC entry 5193 (class 0 OID 962173)
-- Dependencies: 242
-- Data for Name: listing_categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.listing_categories VALUES (1, 'Women''s Clothing', 1, 'static/base_listing_categories/womens_clothing.png', false, NULL, '2025-07-13 13:52:02.666267+02', '2025-07-13 13:52:02.666267+02', NULL);
INSERT INTO public.listing_categories VALUES (2, 'Dresses', 2, 'static/base_listing_categories/womens_clothing.png', false, NULL, '2025-07-13 13:52:02.667124+02', '2025-07-13 13:52:02.667124+02', 1);
INSERT INTO public.listing_categories VALUES (3, 'Skirts', 2, 'static/base_listing_categories/womens_clothing.png', false, NULL, '2025-07-13 13:52:02.667124+02', '2025-07-13 13:52:02.667124+02', 1);
INSERT INTO public.listing_categories VALUES (4, 'Blouses', 2, 'static/base_listing_categories/womens_clothing.png', false, NULL, '2025-07-13 13:52:02.667124+02', '2025-07-13 13:52:02.667124+02', 1);
INSERT INTO public.listing_categories VALUES (5, 'Pants', 2, 'static/base_listing_categories/womens_clothing.png', false, NULL, '2025-07-13 13:52:02.667124+02', '2025-07-13 13:52:02.667124+02', 1);
INSERT INTO public.listing_categories VALUES (6, 'Jumpsuits', 2, 'static/base_listing_categories/womens_clothing.png', false, NULL, '2025-07-13 13:52:02.667124+02', '2025-07-13 13:52:02.667124+02', 1);
INSERT INTO public.listing_categories VALUES (7, 'Outerwear', 2, 'static/base_listing_categories/womens_clothing.png', false, NULL, '2025-07-13 13:52:02.667124+02', '2025-07-13 13:52:02.667124+02', 1);
INSERT INTO public.listing_categories VALUES (8, 'Suits', 2, 'static/base_listing_categories/womens_clothing.png', false, NULL, '2025-07-13 13:52:02.667124+02', '2025-07-13 13:52:02.667124+02', 1);
INSERT INTO public.listing_categories VALUES (9, 'Men''s Clothing', 1, 'static/base_listing_categories/mens_clothing.png', false, NULL, '2025-07-13 13:52:02.668588+02', '2025-07-13 13:52:02.668588+02', NULL);
INSERT INTO public.listing_categories VALUES (10, 'Shirts', 2, 'static/base_listing_categories/mens_clothing.png', false, NULL, '2025-07-13 13:52:02.669061+02', '2025-07-13 13:52:02.669061+02', 9);
INSERT INTO public.listing_categories VALUES (11, 'Pants', 2, 'static/base_listing_categories/mens_clothing.png', false, NULL, '2025-07-13 13:52:02.669061+02', '2025-07-13 13:52:02.669061+02', 9);
INSERT INTO public.listing_categories VALUES (12, 'Suits', 2, 'static/base_listing_categories/mens_clothing.png', false, NULL, '2025-07-13 13:52:02.669061+02', '2025-07-13 13:52:02.669061+02', 9);
INSERT INTO public.listing_categories VALUES (13, 'Blazers', 2, 'static/base_listing_categories/mens_clothing.png', false, NULL, '2025-07-13 13:52:02.669061+02', '2025-07-13 13:52:02.669061+02', 9);
INSERT INTO public.listing_categories VALUES (14, 'T-shirts', 2, 'static/base_listing_categories/mens_clothing.png', false, NULL, '2025-07-13 13:52:02.669061+02', '2025-07-13 13:52:02.669061+02', 9);
INSERT INTO public.listing_categories VALUES (15, 'Outerwear', 2, 'static/base_listing_categories/mens_clothing.png', false, NULL, '2025-07-13 13:52:02.669061+02', '2025-07-13 13:52:02.669061+02', 9);
INSERT INTO public.listing_categories VALUES (16, 'Kids'' Clothing', 1, 'static/base_listing_categories/kids_clothing.png', false, NULL, '2025-07-13 13:52:02.670272+02', '2025-07-13 13:52:02.670272+02', NULL);
INSERT INTO public.listing_categories VALUES (17, 'Rompers & Onesies', 2, 'static/base_listing_categories/kids_clothing.png', false, NULL, '2025-07-13 13:52:02.670682+02', '2025-07-13 13:52:02.670682+02', 16);
INSERT INTO public.listing_categories VALUES (18, 'Dresses', 2, 'static/base_listing_categories/kids_clothing.png', false, NULL, '2025-07-13 13:52:02.670682+02', '2025-07-13 13:52:02.670682+02', 16);
INSERT INTO public.listing_categories VALUES (19, 'Pants', 2, 'static/base_listing_categories/kids_clothing.png', false, NULL, '2025-07-13 13:52:02.670682+02', '2025-07-13 13:52:02.670682+02', 16);
INSERT INTO public.listing_categories VALUES (20, 'Sweaters', 2, 'static/base_listing_categories/kids_clothing.png', false, NULL, '2025-07-13 13:52:02.670682+02', '2025-07-13 13:52:02.670682+02', 16);
INSERT INTO public.listing_categories VALUES (21, 'Jackets', 2, 'static/base_listing_categories/kids_clothing.png', false, NULL, '2025-07-13 13:52:02.670682+02', '2025-07-13 13:52:02.670682+02', 16);
INSERT INTO public.listing_categories VALUES (22, 'Unisex Clothing', 1, 'static/base_listing_categories/unisex_clothing.webp', false, NULL, '2025-07-13 13:52:02.671674+02', '2025-07-13 13:52:02.671674+02', NULL);
INSERT INTO public.listing_categories VALUES (23, 'T-shirts', 2, 'static/base_listing_categories/unisex_clothing.webp', false, NULL, '2025-07-13 13:52:02.672088+02', '2025-07-13 13:52:02.672088+02', 22);
INSERT INTO public.listing_categories VALUES (24, 'Sweatshirts', 2, 'static/base_listing_categories/unisex_clothing.webp', false, NULL, '2025-07-13 13:52:02.672088+02', '2025-07-13 13:52:02.672088+02', 22);
INSERT INTO public.listing_categories VALUES (25, 'Tracksuits', 2, 'static/base_listing_categories/unisex_clothing.webp', false, NULL, '2025-07-13 13:52:02.672088+02', '2025-07-13 13:52:02.672088+02', 22);
INSERT INTO public.listing_categories VALUES (26, 'Accessories', 1, 'static/base_listing_categories/accessories.png', false, NULL, '2025-07-13 13:52:02.672821+02', '2025-07-13 13:52:02.672821+02', NULL);
INSERT INTO public.listing_categories VALUES (27, 'Bags', 2, 'static/base_listing_categories/accessories.png', false, NULL, '2025-07-13 13:52:02.673188+02', '2025-07-13 13:52:02.673188+02', 26);
INSERT INTO public.listing_categories VALUES (28, 'Hats & Beanies', 2, 'static/base_listing_categories/accessories.png', false, NULL, '2025-07-13 13:52:02.673188+02', '2025-07-13 13:52:02.673188+02', 26);
INSERT INTO public.listing_categories VALUES (29, 'Jewelry', 2, 'static/base_listing_categories/accessories.png', false, NULL, '2025-07-13 13:52:02.673188+02', '2025-07-13 13:52:02.673188+02', 26);
INSERT INTO public.listing_categories VALUES (30, 'Belts', 2, 'static/base_listing_categories/accessories.png', false, NULL, '2025-07-13 13:52:02.673188+02', '2025-07-13 13:52:02.673188+02', 26);
INSERT INTO public.listing_categories VALUES (31, 'Sunglasses', 2, 'static/base_listing_categories/accessories.png', false, NULL, '2025-07-13 13:52:02.673188+02', '2025-07-13 13:52:02.673188+02', 26);
INSERT INTO public.listing_categories VALUES (32, 'Footwear', 1, 'static/base_listing_categories/footwear.webp', false, NULL, '2025-07-13 13:52:02.673987+02', '2025-07-13 13:52:02.673987+02', NULL);
INSERT INTO public.listing_categories VALUES (33, 'Shoes', 2, 'static/base_listing_categories/footwear.webp', false, NULL, '2025-07-13 13:52:02.674317+02', '2025-07-13 13:52:02.674317+02', 32);
INSERT INTO public.listing_categories VALUES (34, 'Boots', 2, 'static/base_listing_categories/footwear.webp', false, NULL, '2025-07-13 13:52:02.674317+02', '2025-07-13 13:52:02.674317+02', 32);
INSERT INTO public.listing_categories VALUES (35, 'Sneakers', 2, 'static/base_listing_categories/footwear.webp', false, NULL, '2025-07-13 13:52:02.674317+02', '2025-07-13 13:52:02.674317+02', 32);
INSERT INTO public.listing_categories VALUES (36, 'Sandals', 2, 'static/base_listing_categories/footwear.webp', false, NULL, '2025-07-13 13:52:02.674317+02', '2025-07-13 13:52:02.674317+02', 32);
INSERT INTO public.listing_categories VALUES (37, 'Ankle Boots', 2, 'static/base_listing_categories/footwear.webp', false, NULL, '2025-07-13 13:52:02.674317+02', '2025-07-13 13:52:02.674317+02', 32);


--
-- TOC entry 5201 (class 0 OID 962237)
-- Dependencies: 250
-- Data for Name: listing_category_create_notifications; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5197 (class 0 OID 962207)
-- Dependencies: 246
-- Data for Name: listing_images; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.listing_images VALUES (1, 'storage', 'listings/4dc3e136a36760f831bf.png', 1);
INSERT INTO public.listing_images VALUES (2, 'storage', 'listings/d61083efeea379231e6f.png', 1);
INSERT INTO public.listing_images VALUES (3, 'storage', 'listings/93a6722077c21163e3b6.png', 1);
INSERT INTO public.listing_images VALUES (4, 'storage', 'listings/8eda7904c597c2cc7e5c.jpeg', 2);
INSERT INTO public.listing_images VALUES (5, 'storage', 'listings/49f4188c15f17c3034a9.jpeg', 2);
INSERT INTO public.listing_images VALUES (6, 'storage', 'listings/a595def051b08948ceea.jpeg', 2);
INSERT INTO public.listing_images VALUES (7, 'storage', 'listings/873b71a1616aa3436020.jpeg', 2);
INSERT INTO public.listing_images VALUES (8, 'storage', 'listings/10c2d63ffc6f0ae19d75.jpeg', 2);
INSERT INTO public.listing_images VALUES (9, 'storage', 'listings/6f5d3a7e0e4870464cc6.jpeg', 3);
INSERT INTO public.listing_images VALUES (10, 'storage', 'listings/667f22954cd17e04ffde.jpeg', 3);
INSERT INTO public.listing_images VALUES (11, 'storage', 'listings/9b96d3665eb1743e9d20.jpeg', 3);
INSERT INTO public.listing_images VALUES (12, 'storage', 'listings/4f09dc0a8f1bcfe4e032.jpeg', 3);
INSERT INTO public.listing_images VALUES (13, 'storage', 'listings/39e07d948adeb4639567.jpeg', 3);
INSERT INTO public.listing_images VALUES (14, 'storage', 'listings/3ca50959da5962305182.jpeg', 4);
INSERT INTO public.listing_images VALUES (15, 'storage', 'listings/beee91dd3c7dd3af5442.jpeg', 4);
INSERT INTO public.listing_images VALUES (16, 'storage', 'listings/f13a80a30d2b3af91275.jpeg', 4);
INSERT INTO public.listing_images VALUES (17, 'storage', 'listings/0645ba904e0c7f8df27f.jpeg', 4);
INSERT INTO public.listing_images VALUES (18, 'storage', 'listings/805333ba79abdc37f7a1.jpeg', 4);
INSERT INTO public.listing_images VALUES (19, 'storage', 'listings/4adf7eb12e3ec88db5b0.jpeg', 5);
INSERT INTO public.listing_images VALUES (20, 'storage', 'listings/7f055d1ba640028a637a.jpeg', 5);
INSERT INTO public.listing_images VALUES (21, 'storage', 'listings/f1d843e2fc535ddec494.jpeg', 5);
INSERT INTO public.listing_images VALUES (22, 'storage', 'listings/8f89273c03a59827b2cf.jpeg', 5);
INSERT INTO public.listing_images VALUES (23, 'storage', 'listings/3acb920e933405214ebf.jpeg', 5);
INSERT INTO public.listing_images VALUES (24, 'storage', 'listings/80f2ac56a3f579d1b881.jpeg', 6);
INSERT INTO public.listing_images VALUES (25, 'storage', 'listings/5e79486a693480fe570a.jpeg', 6);
INSERT INTO public.listing_images VALUES (26, 'storage', 'listings/b42825c518fd4b151556.jpeg', 6);
INSERT INTO public.listing_images VALUES (27, 'storage', 'listings/84390e2d6787ec0bee85.jpeg', 6);
INSERT INTO public.listing_images VALUES (28, 'storage', 'listings/6f9841cb8d2a9def682a.jpeg', 6);
INSERT INTO public.listing_images VALUES (29, 'storage', 'listings/fa217ab74559ae37f015.jpeg', 7);
INSERT INTO public.listing_images VALUES (30, 'storage', 'listings/7bea6a894755542fad31.jpeg', 7);
INSERT INTO public.listing_images VALUES (31, 'storage', 'listings/263f06add441c891d8fa.jpeg', 7);
INSERT INTO public.listing_images VALUES (32, 'storage', 'listings/4942954261f75defd0a7.jpeg', 7);
INSERT INTO public.listing_images VALUES (33, 'storage', 'listings/f31292f8025f62be1ce2.jpeg', 7);
INSERT INTO public.listing_images VALUES (34, 'storage', 'listings/e9a7e1fa95354633611c.jpeg', 8);
INSERT INTO public.listing_images VALUES (35, 'storage', 'listings/cf6cdd6f1cfc36847b48.jpeg', 8);
INSERT INTO public.listing_images VALUES (36, 'storage', 'listings/701855e0dfa0a949323c.jpeg', 8);
INSERT INTO public.listing_images VALUES (37, 'storage', 'listings/923c9aadc6f1899a02b6.jpeg', 8);
INSERT INTO public.listing_images VALUES (38, 'storage', 'listings/02e7f20e85a6cb6ee373.jpeg', 8);
INSERT INTO public.listing_images VALUES (39, 'storage', 'listings/d5defff0a576f63b9c76.jpeg', 9);
INSERT INTO public.listing_images VALUES (40, 'storage', 'listings/550c287254386f2a2e74.jpeg', 9);
INSERT INTO public.listing_images VALUES (41, 'storage', 'listings/a1f01b213bbda867f64f.jpeg', 9);
INSERT INTO public.listing_images VALUES (42, 'storage', 'listings/78b657751f6d9e1399c0.jpeg', 9);
INSERT INTO public.listing_images VALUES (43, 'storage', 'listings/ea0232d0f50800b241c5.jpeg', 9);
INSERT INTO public.listing_images VALUES (44, 'storage', 'listings/d5cb82987dac45570e30.jpeg', 10);
INSERT INTO public.listing_images VALUES (45, 'storage', 'listings/52f938507b9867210530.jpeg', 10);
INSERT INTO public.listing_images VALUES (46, 'storage', 'listings/794310ac38fc584f387b.jpeg', 10);
INSERT INTO public.listing_images VALUES (47, 'storage', 'listings/3cd8f3adc89779cd44d2.jpeg', 10);
INSERT INTO public.listing_images VALUES (48, 'storage', 'listings/1833aa3610ca6275dc4c.jpeg', 10);
INSERT INTO public.listing_images VALUES (49, 'storage', 'listings/cbaaa60bb424de0a09fe.jpeg', 11);
INSERT INTO public.listing_images VALUES (50, 'storage', 'listings/b96c0c533a5d254c97a7.jpeg', 11);
INSERT INTO public.listing_images VALUES (51, 'storage', 'listings/fcf28ff7f46fb687daa1.jpeg', 11);
INSERT INTO public.listing_images VALUES (52, 'storage', 'listings/6c0ecd270c844ea1bfb9.jpeg', 11);
INSERT INTO public.listing_images VALUES (53, 'storage', 'listings/ce9991fa9919ccfb2b6d.jpeg', 11);
INSERT INTO public.listing_images VALUES (54, 'storage', 'listings/89df0aab04f5c92a222b.jpeg', 12);
INSERT INTO public.listing_images VALUES (55, 'storage', 'listings/f2ea9966af3c69b8e10a.jpeg', 12);
INSERT INTO public.listing_images VALUES (56, 'storage', 'listings/7ff4c4d224e0e8716602.jpeg', 12);
INSERT INTO public.listing_images VALUES (57, 'storage', 'listings/2dadd3bb6445a172f564.jpeg', 12);
INSERT INTO public.listing_images VALUES (58, 'storage', 'listings/861a8768ce52140845a9.jpeg', 12);
INSERT INTO public.listing_images VALUES (59, 'storage', 'listings/6864688783b444c43060.jpeg', 13);
INSERT INTO public.listing_images VALUES (60, 'storage', 'listings/96f7420890ca8781920f.jpeg', 13);
INSERT INTO public.listing_images VALUES (61, 'storage', 'listings/e06fdfadfdee50d3bf68.jpeg', 13);
INSERT INTO public.listing_images VALUES (62, 'storage', 'listings/cf676f54ad81e49c4f46.jpeg', 13);
INSERT INTO public.listing_images VALUES (63, 'storage', 'listings/d325b1d37095ba267710.jpeg', 13);
INSERT INTO public.listing_images VALUES (64, 'storage', 'listings/185a5bbafe20b1a19a92.jpeg', 14);
INSERT INTO public.listing_images VALUES (65, 'storage', 'listings/c19f33ba48d751400619.jpeg', 14);
INSERT INTO public.listing_images VALUES (66, 'storage', 'listings/3362c81729627bbb775b.jpeg', 14);
INSERT INTO public.listing_images VALUES (67, 'storage', 'listings/e11e77ddd52ec4ecb0fe.jpeg', 14);
INSERT INTO public.listing_images VALUES (68, 'storage', 'listings/48c79c1b28c3dbabce66.jpeg', 14);
INSERT INTO public.listing_images VALUES (69, 'storage', 'listings/64a693466ec9540984cc.jpeg', 15);
INSERT INTO public.listing_images VALUES (70, 'storage', 'listings/c5b99f8afa0894f08bb0.jpeg', 15);
INSERT INTO public.listing_images VALUES (71, 'storage', 'listings/3838e9ecd2935cba08d1.jpeg', 15);
INSERT INTO public.listing_images VALUES (72, 'storage', 'listings/19cbda4bae8f1c9f2406.jpeg', 15);
INSERT INTO public.listing_images VALUES (73, 'storage', 'listings/69c90d647c0fb9cae0b9.jpeg', 15);
INSERT INTO public.listing_images VALUES (74, 'storage', 'listings/ecd7297464328db5c2bc.jpeg', 16);
INSERT INTO public.listing_images VALUES (75, 'storage', 'listings/99fc77bcd6b69dabbed7.jpeg', 16);
INSERT INTO public.listing_images VALUES (76, 'storage', 'listings/4c4d4789708893953ca6.jpeg', 16);
INSERT INTO public.listing_images VALUES (77, 'storage', 'listings/0d9443289f06f155737e.jpeg', 16);
INSERT INTO public.listing_images VALUES (78, 'storage', 'listings/29e1e50055ad2db8f7da.jpeg', 16);
INSERT INTO public.listing_images VALUES (79, 'storage', 'listings/3e9b74406bf25aa41928.jpeg', 17);
INSERT INTO public.listing_images VALUES (80, 'storage', 'listings/0d253185f7f734ca2ad5.jpeg', 17);
INSERT INTO public.listing_images VALUES (81, 'storage', 'listings/1a0d12985f1b199bfa7f.jpeg', 17);
INSERT INTO public.listing_images VALUES (82, 'storage', 'listings/7d88ba19689866fabfd0.jpeg', 17);
INSERT INTO public.listing_images VALUES (83, 'storage', 'listings/c21b0e632f7807ef8c1c.jpeg', 17);
INSERT INTO public.listing_images VALUES (84, 'storage', 'listings/3c363fc63514212542d2.jpeg', 18);
INSERT INTO public.listing_images VALUES (85, 'storage', 'listings/b9bc639c0e76dd593987.jpeg', 18);
INSERT INTO public.listing_images VALUES (86, 'storage', 'listings/13d61fa1d686c4e70289.jpeg', 18);
INSERT INTO public.listing_images VALUES (87, 'storage', 'listings/4459aab6750d6bc99da9.jpeg', 18);
INSERT INTO public.listing_images VALUES (88, 'storage', 'listings/9e801baef6bd42822acc.jpeg', 18);
INSERT INTO public.listing_images VALUES (89, 'storage', 'listings/60db68cf451a03bfeac7.jpeg', 19);
INSERT INTO public.listing_images VALUES (90, 'storage', 'listings/6670be2d11c3fefe95e6.jpeg', 19);
INSERT INTO public.listing_images VALUES (91, 'storage', 'listings/93be63cb2287276148b8.jpeg', 19);
INSERT INTO public.listing_images VALUES (92, 'storage', 'listings/966eb929e1596bc3eaa3.jpeg', 19);
INSERT INTO public.listing_images VALUES (93, 'storage', 'listings/f6e5f236d3daad8d51e2.jpeg', 19);
INSERT INTO public.listing_images VALUES (94, 'storage', 'listings/96a83329ba8983cbcd1f.jpeg', 20);
INSERT INTO public.listing_images VALUES (95, 'storage', 'listings/3b127101e632f13bf42c.jpeg', 20);
INSERT INTO public.listing_images VALUES (96, 'storage', 'listings/bbdc12075d77150a539a.jpeg', 20);
INSERT INTO public.listing_images VALUES (97, 'storage', 'listings/5f49cd7bf10246f8e66d.jpeg', 20);
INSERT INTO public.listing_images VALUES (98, 'storage', 'listings/614238bc8a0b401e70e3.jpeg', 20);
INSERT INTO public.listing_images VALUES (99, 'storage', 'listings/79b6933d41ab622e3a02.jpeg', 21);
INSERT INTO public.listing_images VALUES (100, 'storage', 'listings/e40e4949e638417451ed.jpeg', 21);
INSERT INTO public.listing_images VALUES (101, 'storage', 'listings/505869ece7342b62e16a.jpeg', 21);
INSERT INTO public.listing_images VALUES (102, 'storage', 'listings/3cbc1c62ea2de2114816.jpeg', 21);
INSERT INTO public.listing_images VALUES (103, 'storage', 'listings/d149e34e6b908bfdeff5.jpeg', 21);
INSERT INTO public.listing_images VALUES (104, 'storage', 'listings/e296bfd1b55de1bd157d.jpeg', 22);
INSERT INTO public.listing_images VALUES (105, 'storage', 'listings/52aaa21a4fcdf5b37b37.jpeg', 22);
INSERT INTO public.listing_images VALUES (106, 'storage', 'listings/66c75a0a58cbd2542c84.jpeg', 22);
INSERT INTO public.listing_images VALUES (107, 'storage', 'listings/da2cb49b8a52601b8219.jpeg', 22);
INSERT INTO public.listing_images VALUES (108, 'storage', 'listings/e19b26a8bade1f756411.jpeg', 22);
INSERT INTO public.listing_images VALUES (109, 'storage', 'listings/05ad4436955019b09a51.jpeg', 23);
INSERT INTO public.listing_images VALUES (110, 'storage', 'listings/848ad8d3bc65a2b83463.jpeg', 23);
INSERT INTO public.listing_images VALUES (111, 'storage', 'listings/947d4a5b6af7b0b5c5c0.jpeg', 23);
INSERT INTO public.listing_images VALUES (112, 'storage', 'listings/cbb813f4f38ae24e06f4.jpeg', 23);
INSERT INTO public.listing_images VALUES (113, 'storage', 'listings/dfdc59a18a464a6e492a.jpeg', 23);
INSERT INTO public.listing_images VALUES (114, 'storage', 'listings/aa464e5af99479fc3c68.jpeg', 24);
INSERT INTO public.listing_images VALUES (115, 'storage', 'listings/60ba1109a555c90c441f.jpeg', 24);
INSERT INTO public.listing_images VALUES (116, 'storage', 'listings/b1c656fbb5ba3cb6f451.jpeg', 24);
INSERT INTO public.listing_images VALUES (117, 'storage', 'listings/594214fcf652ca7d453a.jpeg', 24);
INSERT INTO public.listing_images VALUES (118, 'storage', 'listings/4c69b52bea8d481ad0f6.jpeg', 24);
INSERT INTO public.listing_images VALUES (119, 'storage', 'listings/0db95132e9e2c6d5e6ad.jpeg', 25);
INSERT INTO public.listing_images VALUES (120, 'storage', 'listings/5aa670045366300c2241.jpeg', 25);
INSERT INTO public.listing_images VALUES (121, 'storage', 'listings/daa3f1f6a8a1c4ec37f8.jpeg', 25);
INSERT INTO public.listing_images VALUES (122, 'storage', 'listings/a09ea27364189dd2fa11.jpeg', 25);
INSERT INTO public.listing_images VALUES (123, 'storage', 'listings/107a8247ecb8c45b10a7.jpeg', 25);
INSERT INTO public.listing_images VALUES (124, 'storage', 'listings/e111a05c272704030bc2.jpeg', 26);
INSERT INTO public.listing_images VALUES (125, 'storage', 'listings/5fda7ba1c5bc34bc8d78.jpeg', 26);
INSERT INTO public.listing_images VALUES (126, 'storage', 'listings/e9bad09d1a65361292eb.jpeg', 26);
INSERT INTO public.listing_images VALUES (127, 'storage', 'listings/7f6b9ceb0339a9c16a55.jpeg', 26);
INSERT INTO public.listing_images VALUES (128, 'storage', 'listings/ef571bae6f58b57ae34d.jpeg', 26);
INSERT INTO public.listing_images VALUES (129, 'storage', 'listings/7bc441a8d9ab46b8946f.jpeg', 27);
INSERT INTO public.listing_images VALUES (130, 'storage', 'listings/d23cf7a2391ff46d1981.jpeg', 28);
INSERT INTO public.listing_images VALUES (131, 'storage', 'listings/5906ea72b40351981d79.jpeg', 28);
INSERT INTO public.listing_images VALUES (132, 'storage', 'listings/27cd9fbdb1faacf2de3f.jpeg', 28);
INSERT INTO public.listing_images VALUES (133, 'storage', 'listings/87d3f91dde2c3dbcfe6f.jpeg', 28);
INSERT INTO public.listing_images VALUES (134, 'storage', 'listings/96cb78ee25627cfaf725.jpeg', 28);
INSERT INTO public.listing_images VALUES (135, 'storage', 'listings/bd50155361b8a3a05d46.jpeg', 29);
INSERT INTO public.listing_images VALUES (136, 'storage', 'listings/ec2a651a39a00b134137.jpeg', 29);
INSERT INTO public.listing_images VALUES (137, 'storage', 'listings/2ebe3616b3f75230db2a.jpeg', 29);
INSERT INTO public.listing_images VALUES (138, 'storage', 'listings/08b058eccc7de8bfd5f2.jpeg', 29);
INSERT INTO public.listing_images VALUES (139, 'storage', 'listings/f904eb17fd114b087e75.jpeg', 29);
INSERT INTO public.listing_images VALUES (140, 'storage', 'listings/76acb3c2fa9ec7686488.jpeg', 30);
INSERT INTO public.listing_images VALUES (141, 'storage', 'listings/1f24ccb8a402e5a1bf4a.jpeg', 30);
INSERT INTO public.listing_images VALUES (142, 'storage', 'listings/4173e8c8199d29800bfa.jpeg', 30);
INSERT INTO public.listing_images VALUES (143, 'storage', 'listings/0772374d289221aa4ad8.jpeg', 30);
INSERT INTO public.listing_images VALUES (144, 'storage', 'listings/3b77aabf3617d0a667c0.jpeg', 30);
INSERT INTO public.listing_images VALUES (145, 'storage', 'listings/d9c9758cb6b06f9b21b5.jpeg', 31);
INSERT INTO public.listing_images VALUES (146, 'storage', 'listings/57d08f61a3c47dc44add.jpeg', 31);
INSERT INTO public.listing_images VALUES (147, 'storage', 'listings/140d84b6b34b45577620.jpeg', 31);
INSERT INTO public.listing_images VALUES (148, 'storage', 'listings/3aa30344afa9624f19af.jpeg', 31);
INSERT INTO public.listing_images VALUES (149, 'storage', 'listings/0afec6cf98e4ede40d9f.jpeg', 31);
INSERT INTO public.listing_images VALUES (150, 'storage', 'listings/893ff7795d3ce22db4cb.jpeg', 32);
INSERT INTO public.listing_images VALUES (151, 'storage', 'listings/ed6ecdf5cf06f3340d57.jpeg', 32);
INSERT INTO public.listing_images VALUES (152, 'storage', 'listings/fd966cec84d7be8fa07d.jpeg', 32);
INSERT INTO public.listing_images VALUES (153, 'storage', 'listings/f83720c5ad8b2b945113.jpeg', 32);
INSERT INTO public.listing_images VALUES (154, 'storage', 'listings/f7fad78a10acf6bfe0a0.jpeg', 32);
INSERT INTO public.listing_images VALUES (155, 'storage', 'listings/ac6c598dd25483f61233.jpeg', 33);
INSERT INTO public.listing_images VALUES (156, 'storage', 'listings/4adc707f805982624caf.jpeg', 33);
INSERT INTO public.listing_images VALUES (157, 'storage', 'listings/77d71192e1e8db0b8796.jpeg', 33);
INSERT INTO public.listing_images VALUES (158, 'storage', 'listings/c12846934eb59a000cdb.jpeg', 33);
INSERT INTO public.listing_images VALUES (159, 'storage', 'listings/0c68a4189b548ad2b586.jpeg', 33);
INSERT INTO public.listing_images VALUES (160, 'storage', 'listings/e0a6098a375430047d35.jpeg', 34);
INSERT INTO public.listing_images VALUES (161, 'storage', 'listings/4873cedadf2418aed9fa.jpeg', 34);
INSERT INTO public.listing_images VALUES (162, 'storage', 'listings/7725113db2b44a3e2185.jpeg', 34);
INSERT INTO public.listing_images VALUES (163, 'storage', 'listings/2c4fd6f267103aacd83a.jpeg', 34);
INSERT INTO public.listing_images VALUES (164, 'storage', 'listings/0fdb9d2b35f2060be60c.jpeg', 34);
INSERT INTO public.listing_images VALUES (165, 'storage', 'listings/774c72b7ba6e4e1d873b.jpeg', 35);
INSERT INTO public.listing_images VALUES (166, 'storage', 'listings/9db3f0ca2e248466f845.jpeg', 35);
INSERT INTO public.listing_images VALUES (167, 'storage', 'listings/88c13b3af1f2e0da0d53.jpeg', 35);
INSERT INTO public.listing_images VALUES (168, 'storage', 'listings/e5313b1b7851ea054651.jpeg', 35);
INSERT INTO public.listing_images VALUES (169, 'storage', 'listings/f1d90b24d8f1e18cbced.jpeg', 35);
INSERT INTO public.listing_images VALUES (170, 'storage', 'listings/bcd3b62935593bb19689.jpeg', 36);
INSERT INTO public.listing_images VALUES (171, 'storage', 'listings/a551c5d27ce1a4423137.jpeg', 36);
INSERT INTO public.listing_images VALUES (172, 'storage', 'listings/acdeb823ff61835cda6f.jpeg', 36);
INSERT INTO public.listing_images VALUES (173, 'storage', 'listings/224639974daa5fda20f2.jpeg', 36);
INSERT INTO public.listing_images VALUES (174, 'storage', 'listings/590c61a98eddea08b928.jpeg', 36);
INSERT INTO public.listing_images VALUES (175, 'storage', 'listings/f9f4438c131237bc8f37.jpeg', 37);
INSERT INTO public.listing_images VALUES (176, 'storage', 'listings/06adf732d1092cdca4f4.jpeg', 37);
INSERT INTO public.listing_images VALUES (177, 'storage', 'listings/b64d5c34391a3c890633.jpeg', 37);
INSERT INTO public.listing_images VALUES (178, 'storage', 'listings/f8b3a4a77ce06a8ce0dd.jpeg', 37);
INSERT INTO public.listing_images VALUES (179, 'storage', 'listings/ff88e267a8b6e494ef78.jpeg', 37);
INSERT INTO public.listing_images VALUES (180, 'storage', 'listings/c82ecae54b305ddbe0b8.jpeg', 38);
INSERT INTO public.listing_images VALUES (181, 'storage', 'listings/f4d5a2644f5aa1dbfa08.jpeg', 38);
INSERT INTO public.listing_images VALUES (182, 'storage', 'listings/340feba1770a2aaab542.jpeg', 38);
INSERT INTO public.listing_images VALUES (183, 'storage', 'listings/609c318d03e6644c592e.jpeg', 38);
INSERT INTO public.listing_images VALUES (184, 'storage', 'listings/1f13570a701398007bfa.jpeg', 38);
INSERT INTO public.listing_images VALUES (185, 'storage', 'listings/669b13c352d9871e3a3f.jpeg', 39);
INSERT INTO public.listing_images VALUES (186, 'storage', 'listings/58b3e28eacb6f4266f09.jpeg', 39);
INSERT INTO public.listing_images VALUES (187, 'storage', 'listings/2fb1c831f56eb70815ab.jpeg', 39);
INSERT INTO public.listing_images VALUES (188, 'storage', 'listings/260a8122beae3543a52f.jpeg', 39);
INSERT INTO public.listing_images VALUES (189, 'storage', 'listings/77fced2e859567c62652.jpeg', 39);
INSERT INTO public.listing_images VALUES (190, 'storage', 'listings/52d469b9f363fa1bb4a7.jpeg', 40);
INSERT INTO public.listing_images VALUES (191, 'storage', 'listings/f987586b29df5e4534c4.jpeg', 40);
INSERT INTO public.listing_images VALUES (192, 'storage', 'listings/1fff6f160b3e63f7e3b1.jpeg', 40);
INSERT INTO public.listing_images VALUES (193, 'storage', 'listings/43afa75460de9045a4b6.jpeg', 40);
INSERT INTO public.listing_images VALUES (194, 'storage', 'listings/6ca586818a83691647d6.jpeg', 40);
INSERT INTO public.listing_images VALUES (195, 'storage', 'listings/8b8ea898c7617b91032d.jpeg', 41);
INSERT INTO public.listing_images VALUES (196, 'storage', 'listings/df76a7063adde968e256.jpeg', 41);
INSERT INTO public.listing_images VALUES (197, 'storage', 'listings/48a5461b04bcc2427791.png', 41);
INSERT INTO public.listing_images VALUES (198, 'storage', 'listings/e7925010cfb8618ae996.png', 41);
INSERT INTO public.listing_images VALUES (199, 'storage', 'listings/e946247ba87a3868aed9.png', 41);
INSERT INTO public.listing_images VALUES (200, 'storage', 'listings/f59281df52dc83bc21c8.jpeg', 42);
INSERT INTO public.listing_images VALUES (201, 'storage', 'listings/2c05860cc8963be2b15b.jpeg', 42);
INSERT INTO public.listing_images VALUES (202, 'storage', 'listings/5da0a21f76b1f06e1be3.jpeg', 42);
INSERT INTO public.listing_images VALUES (203, 'storage', 'listings/2055cdad72d2df84d1ea.jpeg', 42);
INSERT INTO public.listing_images VALUES (204, 'storage', 'listings/22a77ca0cda0df3d0ee8.jpeg', 42);
INSERT INTO public.listing_images VALUES (205, 'storage', 'listings/61de86d2dfa0470dfd30.jpeg', 43);
INSERT INTO public.listing_images VALUES (206, 'storage', 'listings/880867123803a6cc4149.jpeg', 43);
INSERT INTO public.listing_images VALUES (207, 'storage', 'listings/2b83e1f575e85d9e1847.jpeg', 43);
INSERT INTO public.listing_images VALUES (208, 'storage', 'listings/dd9a70c961bef5403741.jpeg', 43);
INSERT INTO public.listing_images VALUES (209, 'storage', 'listings/df4ba5501821787496a5.jpeg', 43);
INSERT INTO public.listing_images VALUES (210, 'storage', 'listings/a73708a50319b5e1c637.jpeg', 44);
INSERT INTO public.listing_images VALUES (211, 'storage', 'listings/de9c10c166e154015da6.jpeg', 44);
INSERT INTO public.listing_images VALUES (212, 'storage', 'listings/37309bbe46805e7d19f0.jpeg', 44);
INSERT INTO public.listing_images VALUES (213, 'storage', 'listings/54605eb72484f0344e41.jpeg', 44);
INSERT INTO public.listing_images VALUES (214, 'storage', 'listings/659d4cea98c25a0f1c93.jpeg', 44);
INSERT INTO public.listing_images VALUES (215, 'storage', 'listings/0ac3d68179dbc8732940.jpeg', 45);
INSERT INTO public.listing_images VALUES (216, 'storage', 'listings/08ece03869b2674c0cb8.jpeg', 45);
INSERT INTO public.listing_images VALUES (217, 'storage', 'listings/b06c7942a63e6a4e1781.jpeg', 45);
INSERT INTO public.listing_images VALUES (218, 'storage', 'listings/02185ca281221ffedd21.jpeg', 45);
INSERT INTO public.listing_images VALUES (219, 'storage', 'listings/1fcd66e4c150984ae96f.jpeg', 45);
INSERT INTO public.listing_images VALUES (220, 'storage', 'listings/a16894146a83a7cbee50.jpeg', 46);
INSERT INTO public.listing_images VALUES (221, 'storage', 'listings/bb940c5750cd54b0264f.jpeg', 46);
INSERT INTO public.listing_images VALUES (222, 'storage', 'listings/7cf76769d5d23d3bc955.jpeg', 46);
INSERT INTO public.listing_images VALUES (223, 'storage', 'listings/0d6c0be666a59ff01b0a.jpeg', 46);
INSERT INTO public.listing_images VALUES (224, 'storage', 'listings/fab2e68a7b36b8cd2559.jpeg', 46);
INSERT INTO public.listing_images VALUES (225, 'storage', 'listings/e4893b0c16fe51833609.jpeg', 47);
INSERT INTO public.listing_images VALUES (226, 'storage', 'listings/ffe029695fce8c19daa3.jpeg', 47);
INSERT INTO public.listing_images VALUES (227, 'storage', 'listings/5e0caaa800961714c293.jpeg', 47);
INSERT INTO public.listing_images VALUES (228, 'storage', 'listings/3bb1f2767d1ca20bc7ce.jpeg', 47);
INSERT INTO public.listing_images VALUES (229, 'storage', 'listings/74898cc5182761e2d40d.jpeg', 47);
INSERT INTO public.listing_images VALUES (230, 'storage', 'listings/1c10013db90d0d73e46e.jpeg', 48);
INSERT INTO public.listing_images VALUES (231, 'storage', 'listings/4ee7799316c057e61a01.jpeg', 48);
INSERT INTO public.listing_images VALUES (232, 'storage', 'listings/627463f3a4a729660730.jpeg', 48);
INSERT INTO public.listing_images VALUES (233, 'storage', 'listings/ebcf4c681bab670bf01f.jpeg', 48);
INSERT INTO public.listing_images VALUES (234, 'storage', 'listings/db5bd551eeb52d5e47a6.jpeg', 48);
INSERT INTO public.listing_images VALUES (235, 'storage', 'listings/b0d75d423e2d9315c3ac.jpeg', 49);
INSERT INTO public.listing_images VALUES (236, 'storage', 'listings/180dc7101aec6329f4a8.jpeg', 49);
INSERT INTO public.listing_images VALUES (237, 'storage', 'listings/d27f991b2a22c9b5d367.jpeg', 49);
INSERT INTO public.listing_images VALUES (238, 'storage', 'listings/bafb9b5fa691c0107964.jpeg', 49);
INSERT INTO public.listing_images VALUES (239, 'storage', 'listings/3728ea3c6e0c94115227.jpeg', 49);
INSERT INTO public.listing_images VALUES (240, 'storage', 'listings/b144ec497220bd94b1d7.jpeg', 50);
INSERT INTO public.listing_images VALUES (241, 'storage', 'listings/ba5b00b1722cc85264b6.jpeg', 50);
INSERT INTO public.listing_images VALUES (242, 'storage', 'listings/924311768f9a1129a201.jpeg', 50);
INSERT INTO public.listing_images VALUES (243, 'storage', 'listings/9af259f1ee9f7e4b7a79.jpeg', 50);
INSERT INTO public.listing_images VALUES (244, 'storage', 'listings/acaa0952dc67ee56e1bd.jpeg', 50);
INSERT INTO public.listing_images VALUES (245, 'storage', 'listings/62dd36ccc472ba9e7970.jpeg', 51);
INSERT INTO public.listing_images VALUES (246, 'storage', 'listings/ce06a97846f84d1249bd.jpeg', 51);
INSERT INTO public.listing_images VALUES (247, 'storage', 'listings/529276326b18ce84792d.jpeg', 51);
INSERT INTO public.listing_images VALUES (248, 'storage', 'listings/7dca9037828d601a32e2.jpeg', 51);
INSERT INTO public.listing_images VALUES (249, 'storage', 'listings/2068f33ea7b5897c6f2a.jpeg', 51);


--
-- TOC entry 5191 (class 0 OID 962153)
-- Dependencies: 240
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.listings VALUES (28, 'Blouse', 'Light blouse for casual or office style.', 'Lypynskoho St, буд.36, L''viv, L''vivs''ka oblast, Ukraine, 79019', 5, '58315', 'Lviv', 49.8617, 24.031889, 1177.5171, NULL, NULL, true, 4, NULL, true, '2025-08-17 16:26:53.510339+02', '2025-08-17 16:26:53.510339+02', 10);
INSERT INTO public.listings VALUES (29, 'Jacket', 'Stylish outerwear for any season.', 'FH34+44 Спортивная база КГГА, Kyiv, Ukraine, 02000', 8.81, '02000', 'Kyiv', 50.45332, 30.554998, 500, NULL, NULL, true, 7, NULL, true, '2025-08-17 16:29:23.586296+02', '2025-08-17 16:29:23.586296+02', 10);
INSERT INTO public.listings VALUES (1, 'Men''s low-top sneakers Puma Rebound v6 Low 39232843 44', 'The basketball-inspired Rebound Low collection returns to change the rules of the game. The low-cut V6 looks just as good on and off the court, while the crushed leather upper and signature PUMA colorblock details make a lasting impression.', 'New Scotland Yard, London SW1A 2JL, UK', 10, 'SW1A 0AA', 'Zhytomyr', 51.503, -0.124862425, 15579.858, NULL, NULL, true, 34, NULL, true, '2025-08-10 11:55:33.461206+02', '2025-08-10 11:55:33.461206+02', 1);
INSERT INTO public.listings VALUES (2, 'Loafers', 'Classic shoes for everyday wear or formal occasions.', 'Parkova 185 kiyv', 5.45, '01451', 'Kyiv', 50.49268, 30.433298, 500, NULL, NULL, true, 33, NULL, true, '2025-08-17 14:48:42.891526+02', '2025-08-17 14:48:42.891526+02', 19);
INSERT INTO public.listings VALUES (3, 'T-shirt', 'Basic cotton T-shirt for daily comfort.', 'Beresteiska, Kyiv, Ukraine, 02000', 8.7, '01814', 'Kyiv', 50.458717, 30.419563, 500, NULL, NULL, true, 23, NULL, true, '2025-08-17 15:04:40.53929+02', '2025-08-17 15:04:40.53929+02', 16);
INSERT INTO public.listings VALUES (4, 'Kids jacket', 'Lightweight jacket for casual wear.', 'Ivan Mykolaichuk St, 38, Vinnytsia, Vinnyts''ka oblast, Ukraine, 21000', 5, '21809', 'Vinnytsia', 49.226692, 28.440466, 500, NULL, NULL, true, 21, NULL, true, '2025-08-17 15:07:15.533398+02', '2025-08-17 15:07:15.533398+02', 16);
INSERT INTO public.listings VALUES (5, 'Overall', 'Comfortable jumpsuit for a modern look.', '36B, Novosinna St, 36Б, Zhytomyr, Zhytomyrs''ka oblast, Ukraine, 10001', 8.8, '10001', 'Zhytomyr', 50.266705, 28.646362, 500, NULL, NULL, true, 6, NULL, true, '2025-08-17 15:10:17.446266+02', '2025-08-17 15:10:17.446266+02', 16);
INSERT INTO public.listings VALUES (6, 'Sweater', 'Warm knitted sweater for cooler days.', 'Pokrovska Square, 11, Sumy, Sums''ka oblast, Ukraine, 40000', 5, '40000', 'Sumy', 50.907753, 34.79718, 500, NULL, NULL, true, 20, NULL, true, '2025-08-17 15:12:47.327856+02', '2025-08-17 15:12:47.327856+02', 6);
INSERT INTO public.listings VALUES (7, 'Sweatshirt', 'Casual sweatshirt for sports or leisure.', 'Kharkivs''ka St, 23-1, Sumy, Sums''ka oblast, Ukraine, 40000', 5, '40000', 'Sumy', 50.90403, 34.813488, 500, NULL, NULL, true, 24, NULL, true, '2025-08-17 15:15:14.385018+02', '2025-08-17 15:15:14.385018+02', 7);
INSERT INTO public.listings VALUES (8, 'Jacket', 'Stylish outerwear for any season.', 'Soborna St, 5, Rivne, Rivnens''ka oblast, Ukraine, 33000', 5.1, '33000', 'Rivne', 50.617878, 26.261665, 500, NULL, NULL, true, 15, NULL, true, '2025-08-17 15:20:54.45756+02', '2025-08-17 15:20:54.45756+02', 29);
INSERT INTO public.listings VALUES (9, 'Romper', 'Comfortable romper or onesie for kids or adults.', 'Soborna St, 328, Rivne, Rivnens''ka oblast, Ukraine, 33000', 5, '33000', 'Rivne', 50.621582, 26.231796, 500, NULL, NULL, true, 17, NULL, true, '2025-08-17 15:23:18.420272+02', '2025-08-17 15:23:18.420272+02', 29);
INSERT INTO public.listings VALUES (10, 'Suit', 'Classic suit for work or formal events.', 'Soborna, 20, Kyiv, Ukraine, 02000', 4.7, '02000', 'Kyiv', 50.37012, 30.619501, 500, NULL, NULL, true, 12, NULL, true, '2025-08-17 15:25:18.464436+02', '2025-08-17 15:25:18.464436+02', 18);
INSERT INTO public.listings VALUES (11, 'Shirt', 'Smart shirt for office or casual style.', 'Pokrovska Square, 2, Sumy, Sums''ka oblast, Ukraine, 40000', 7.8, '40000', 'Sumy', 50.907375, 34.799644, 500, NULL, NULL, true, 10, NULL, true, '2025-08-17 15:29:18.507541+02', '2025-08-17 15:29:18.507541+02', 16);
INSERT INTO public.listings VALUES (12, 'Casual shirt', 'Smart shirt for office or casual style.', 'Deputats''ka St, 28, Sumy, Sums''ka oblast, Ukraine, 40000', 5.3, '40000', 'Sumy', 50.922752, 34.773834, 500, NULL, NULL, true, 10, NULL, true, '2025-08-17 15:41:48.542552+02', '2025-08-17 15:41:48.542552+02', 20);
INSERT INTO public.listings VALUES (13, 'Ring', 'Elegant jewelry to complete your look.', 'Vulytsya Vasylya Chervoniya, 3, Rivne, Rivnens''ka oblast, Ukraine, 33000', 5.1, '33000', 'Rivne', 50.6267, 26.261665, 500, NULL, NULL, true, 29, NULL, true, '2025-08-17 15:44:36.193859+02', '2025-08-17 15:44:36.193859+02', 20);
INSERT INTO public.listings VALUES (14, 'Onesie', 'Comfortable romper or onesie for kids or adults.', 'Mohyl''nyts''koho St, 28, L''viv, L''vivs''ka oblast, Ukraine, 79000', 5.07, '79000', 'Lviv', 49.858288, 24.021074, 500, NULL, NULL, true, 17, NULL, true, '2025-08-17 15:47:01.111949+02', '2025-08-17 15:47:01.111949+02', 12);
INSERT INTO public.listings VALUES (15, 'Evening dress', 'Elegant dress for casual or evening wear.', 'Shkiriana St, 15, L''viv, L''vivs''ka oblast, Ukraine, 79000', 5, '79000', 'Lviv', 49.869305, 24.049244, 1337.5256, NULL, NULL, true, 2, NULL, true, '2025-08-17 15:50:26.795884+02', '2025-08-17 15:50:26.795884+02', 19);
INSERT INTO public.listings VALUES (16, 'Toddler Girl Dresses', 'Bright and comfy clothing for kids.', 'Basova St, 9, Zhytomyr, Zhytomyrs''ka oblast, Ukraine, 10001', 7.61, '10001', 'Zhytomyr', 50.28961, 28.618345, 939.51855, NULL, NULL, true, 18, NULL, true, '2025-08-17 15:53:54.776252+02', '2025-08-17 15:53:54.776252+02', 10);
INSERT INTO public.listings VALUES (17, 'Business suit', 'Classic suit for work or formal events.', 'Yevhena Chykalenka St, 1-3, Kyiv, Ukraine, 02000', 12.4, '02000', 'Kyiv', 50.44763, 30.519855, 1680.3401, NULL, NULL, true, 12, NULL, true, '2025-08-17 15:56:42.122524+02', '2025-08-17 15:56:42.122524+02', 28);
INSERT INTO public.listings VALUES (18, 'Cap', 'Trendy hat or beanie for casual outfits.', 'Horodotska St, 151, L''viv, L''vivs''ka oblast, Ukraine, 79000', 8.95, '79000', 'Lviv', 49.836594, 24.001162, 500, NULL, NULL, true, 28, NULL, true, '2025-08-17 15:59:07.172481+02', '2025-08-17 15:59:07.172481+02', 12);
INSERT INTO public.listings VALUES (19, 'Handbag', 'Stylish handbag or bag for daily use.', 'Vulytsya Zbroynykh Syl Ukrayiny, 15, Sumy, Sums''ka oblast, Ukraine, 40000', 9.76, '40000', 'Sumy', 50.913013, 34.828766, 4343.432, NULL, NULL, true, 27, NULL, true, '2025-08-17 16:01:48.809764+02', '2025-08-17 16:01:48.809764+02', 3);
INSERT INTO public.listings VALUES (20, 'Jacket', 'Lightweight jacket for casual wear.', '87A, Kyivs''ke Hwy, 87А, Zhytomyr, Zhytomyrs''ka oblast, Ukraine, 10001', 6.48, '10001', 'Zhytomyr', 50.282307, 28.723267, 500, NULL, NULL, true, 21, NULL, true, '2025-08-17 16:05:03.624871+02', '2025-08-17 16:05:03.624871+02', 3);
INSERT INTO public.listings VALUES (21, 'Long skirt', 'Skirt in different lengths for women’s wardrobe.', 'Olexandr Dovzhenko St, 75, Vinnytsia, Vinnyts''ka oblast, Ukraine, 21000', 7.2, '21000', 'Vinnytsia', 49.23354, 28.497168, 500, NULL, NULL, true, 3, NULL, true, '2025-08-17 16:07:57.775726+02', '2025-08-17 16:07:57.775726+02', 29);
INSERT INTO public.listings VALUES (22, 'Casual dress', 'Elegant dress for casual or evening wear.', 'Stetsenka St, 23, Kyiv, Ukraine, 02000', 7.71, '02000', 'Kyiv', 50.486656, 30.390594, 500, NULL, NULL, true, 2, NULL, true, '2025-08-17 16:10:02.436758+02', '2025-08-17 16:10:02.436758+02', 20);
INSERT INTO public.listings VALUES (23, 'Bracelet', 'Elegant jewelry to complete your look.', 'Kyivs''ka St, 9, Vinnytsia, Vinnyts''ka oblast, Ukraine, 21000', 5.2, '21000', 'Vinnytsia', 49.236656, 28.482914, 2097.072, NULL, NULL, true, 29, NULL, true, '2025-08-17 16:11:37.74366+02', '2025-08-17 16:11:37.74366+02', 3);
INSERT INTO public.listings VALUES (24, 'Leggings', 'Group network important technology board it have character specific would work.', 'Svobody Ave, 28, L''viv, L''vivs''ka oblast, Ukraine, 79000', 5.74, '79000', 'Lviv', 49.84407, 24.02607, 500, NULL, NULL, true, 19, NULL, true, '2025-08-17 16:14:11.333028+02', '2025-08-17 16:14:11.333028+02', 3);
INSERT INTO public.listings VALUES (25, 'Tracksuit', 'Sporty tracksuit for training and everyday wear.', 'Pyvzavod, Rivne, Rivnens''ka oblast, Ukraine, 33017', 6.12, '33017', 'Rivne', 50.62189, 26.230806, 936.4138, NULL, NULL, true, 25, NULL, true, '2025-08-17 16:21:12.003817+02', '2025-08-17 16:21:12.003817+02', 6);
INSERT INTO public.listings VALUES (26, 'Ring', 'Elegant jewelry to complete your look.', 'Trts Hlobal, Kyivska St, 77, Zhytomyr, Zhytomyrs''ka oblast, Ukraine, 10001', 6.06, '10001', 'Zhytomyr', 50.26685, 28.68599, 500, NULL, NULL, true, 29, NULL, true, '2025-08-17 16:23:30.318124+02', '2025-08-17 16:23:30.318124+02', 6);
INSERT INTO public.listings VALUES (27, 'Necklace', 'Elegant jewelry to complete your look.', 'Hryhoriia Skovorody St, 4, Vinnytsia, Vinnyts''ka oblast, Ukraine, 21000', 8.77, '08982', 'Vinnytsia', 49.232384, 28.466768, 6015.366, NULL, NULL, true, 29, NULL, true, '2025-08-17 16:25:07.527474+02', '2025-08-17 16:25:07.527474+02', 28);
INSERT INTO public.listings VALUES (30, 'Trench Coats', 'Universal clothing suitable for men and women.', 'Hetmana Mazepy St, 45, Vinnytsia, Vinnyts''ka oblast, Ukraine, 21000', 7.99, '21000', 'Vinnytsia', 49.221355, 28.53127, 2543.579, 'Coats', NULL, true, NULL, 22, true, '2025-08-17 16:33:02.561635+02', '2025-08-17 16:33:02.561635+02', 20);
INSERT INTO public.listings VALUES (31, 'Sunglasses', 'Fashionable accessories for daily outfits.', 'Pavla Pashchevskoho St, 14, Rivne, Rivnens''ka oblast, Ukraine, 33017', 7.2, '33017', 'Rivne', 50.621693, 26.275742, 1385.0255, NULL, NULL, true, 31, NULL, true, '2025-08-17 16:35:09.858219+02', '2025-08-17 16:35:09.858219+02', 10);
INSERT INTO public.listings VALUES (32, 'Flip flops', 'Light sandals for summer days.', 'Chernecha Hora St, 1, L''viv, L''vivs''ka oblast, Ukraine, 79000', 5, '79000', 'Lviv', 49.843296, 24.062805, 500, NULL, NULL, true, 36, NULL, true, '2025-08-17 16:36:56.955669+02', '2025-08-17 16:36:56.955669+02', 12);
INSERT INTO public.listings VALUES (33, 'Jacket', 'Lightweight jacket for casual wear.', 'Vitruka St, 38, Zhytomyr, Zhytomyrs''ka oblast, Ukraine, 10002', 5.9, '10002', 'Zhytomyr', 50.240383, 28.701637, 1379.9602, NULL, NULL, true, 21, NULL, true, '2025-08-17 16:42:41.807097+02', '2025-08-17 16:42:41.807097+02', 20);
INSERT INTO public.listings VALUES (34, 'Sneakers', 'Versatile footwear for casual or smart wear.', 'Igor Sikorsky St, 30, Vinnytsia, Vinnyts''ka oblast, Ukraine, 21000', 7.47, '21000', 'Vinnytsia', 49.23018, 28.492876, 1697.961, NULL, NULL, true, 35, NULL, true, '2025-08-17 16:44:27.779061+02', '2025-08-17 16:44:27.779061+02', 3);
INSERT INTO public.listings VALUES (35, 'Pants', 'Essential men’s clothing for daily style.', 'Aeroport Zhytomyr, Aviatoriv St, 9, Zhytomyr, Zhytomyrs''ka oblast, Ukraine, 10002', 7.72, '10002', 'Zhytomyr', 50.276505, 28.735085, 2270.7988, NULL, NULL, true, 11, NULL, true, '2025-08-17 16:46:19.105101+02', '2025-08-17 16:46:19.105101+02', 29);
INSERT INTO public.listings VALUES (36, 'Leggings', 'Test military attack concern thousand young to cold couple practice', 'Solomii Krushel''nyts''koi St, 54, Rivne, Rivnens''ka oblast, Ukraine, 33000', 5, '33000', 'Rivne', 50.6157, 26.268703, 1554.7784, NULL, NULL, true, 19, NULL, true, '2025-08-17 16:49:54.684505+02', '2025-08-17 16:49:54.684505+02', 12);
INSERT INTO public.listings VALUES (37, 'Tracksuit', 'Sporty tracksuit for training and everyday wear.', 'Yevhena Konovaltsia St, 8, Vinnytsia, Vinnyts''ka oblast, Ukraine, 21000', 8.8, '21000', 'Vinnytsia', 49.231186, 28.487555, 1585.63, NULL, NULL, true, 25, NULL, true, '2025-08-17 16:53:03.655395+02', '2025-08-17 16:53:03.655395+02', 12);
INSERT INTO public.listings VALUES (38, 'Long skirt', 'Skirt in different lengths for women’s wardrobe.', 'Sicheslavska St, 2, Kyiv, Ukraine, 02000', 7.1, '02000', 'Kyiv', 50.442387, 30.483807, 3517.9229, NULL, NULL, true, 3, NULL, true, '2025-08-17 16:55:02.57754+02', '2025-08-17 16:55:02.57754+02', 26);
INSERT INTO public.listings VALUES (39, 'Organic Hemp', 'Fashionable accessories for daily outfits.', 'Dmytra Maiborody St, 7, Vinnytsia, Vinnyts''ka oblast, Ukraine, 21000', 3.2, '21000', 'Vinnytsia', 49.23287, 28.442923, 500, NULL, NULL, true, 28, NULL, true, '2025-08-17 16:57:22.046275+02', '2025-08-17 16:57:22.046275+02', 29);
INSERT INTO public.listings VALUES (40, 'Pants', 'Rich entire field than threat child fight candidate hospital everyone effect alone law report rather special.', 'Zaliznychna St, 20, L''viv, L''vivs''ka oblast, Ukraine, 79000', 5, '79000', 'Lviv', 49.83936, 24.001162, 191.89532, NULL, NULL, true, 11, NULL, true, '2025-08-17 17:01:00.799717+02', '2025-08-17 17:01:00.799717+02', 6);
INSERT INTO public.listings VALUES (41, 'Sunglasses', 'Trendy sunglasses for sunny days.', 'Heroiv Pozhezhnykiv St, 120, Zhytomyr, Zhytomyrs''ka oblast, Ukraine, 10001', 9.65, '10001', 'Zhytomyr', 50.259705, 28.628853, 1245.2197, NULL, NULL, true, 31, NULL, true, '2025-08-17 17:02:33.315856+02', '2025-08-17 17:02:33.315856+02', 18);
INSERT INTO public.listings VALUES (42, 'Skirt', 'Skirt in different lengths for women’s wardrobe.', 'Ukrains''ka St, 8, Vinnytsia, Vinnyts''ka oblast, Ukraine, 21000', 8.69, '21000', 'Vinnytsia', 49.20874, 28.467127, 1124.2087, NULL, NULL, true, 3, NULL, true, '2025-08-17 20:56:27.802493+02', '2025-08-17 20:56:27.802493+02', 18);
INSERT INTO public.listings VALUES (43, 'Ankle boots', 'Classic ankle boots for versatile outfits.', 'Mykoly Khvyl''ovoho St, 12, Rivne, Rivnens''ka oblast, Ukraine, 33017', 7.6, '33017', 'Rivne', 50.6206, 26.260807, 1797.2172, NULL, NULL, true, 37, NULL, true, '2025-08-17 20:59:28.614598+02', '2025-08-17 20:59:28.614598+02', 10);
INSERT INTO public.listings VALUES (44, 'Blazer', 'Tailored blazer for a smart look.', 'Zakhisnykiv Mariupolia St, 42, Rivne, Rivnens''ka oblast, Ukraine, 33000', 8.04, '33000', 'Rivne', 50.62997, 26.287758, 1737.965, NULL, NULL, true, 13, NULL, true, '2025-08-17 21:02:29.153007+02', '2025-08-17 21:02:29.153007+02', 19);
INSERT INTO public.listings VALUES (45, 'Silk blouse', 'Light blouse for casual or office style.', 'Dnipro, Kyiv, Ukraine, 02000', 5, '02000', 'Kyiv', 50.440727, 30.55929, 1765.7039, NULL, NULL, true, 4, NULL, true, '2025-08-17 21:04:23.151765+02', '2025-08-17 21:04:23.151765+02', 3);
INSERT INTO public.listings VALUES (46, 'Dress shoes', 'Classic shoes for everyday wear or formal occasions.', 'Pravednykiv svitu St, 29, Vinnytsia, Vinnyts''ka oblast, Ukraine, 21000', 5, '21000', 'Vinnytsia', 49.24105, 28.426786, 1672.7454, NULL, NULL, true, 33, NULL, true, '2025-08-17 21:06:12.847022+02', '2025-08-17 21:06:12.847022+02', 26);
INSERT INTO public.listings VALUES (47, 'Blouse', 'Light blouse for casual or office style.', 'Pokrovska St, 8, Rivne, Rivnens''ka oblast, Ukraine, 33017', 5, '33017', 'Rivne', 50.62036, 26.266472, 3058.1597, NULL, NULL, true, 4, NULL, true, '2025-08-17 21:08:59.533051+02', '2025-08-17 21:08:59.533051+02', 3);
INSERT INTO public.listings VALUES (48, 'Footwear', 'Versatile footwear for casual or smart wear.', 'Vulytsya Maksyma Berezovsʹkoho, 2, Sumy, Sums''ka oblast, Ukraine, 40000', 5, '40000', 'Sumy', 50.90457, 34.778297, 1476.0956, NULL, NULL, true, 37, NULL, true, '2025-08-17 21:10:44.747487+02', '2025-08-17 21:10:44.747487+02', 3);
INSERT INTO public.listings VALUES (49, 'T-shirt', 'Essential men’s clothing for daily style.', 'Bratslavska St, 62, Vinnytsia, Vinnyts''ka oblast, Ukraine, 21000', 5, '21000', 'Vinnytsia', 49.233883, 28.492876, 1298.5808, NULL, NULL, true, 14, NULL, true, '2025-08-17 21:18:40.182759+02', '2025-08-17 21:18:40.182759+02', 26);
INSERT INTO public.listings VALUES (50, 'Devil costume', 'Demon costume with dark mystique, fiery accents, and a striking sinister look.', 'Sichovykh Striltsiv St, 46, Kyiv, Ukraine, 02000', 35, '02000', 'Kyiv', 50.4566, 30.493715, 962.3136, NULL, NULL, true, 18, NULL, true, '2025-08-17 21:22:48.160308+02', '2025-08-17 21:22:48.160308+02', 28);
INSERT INTO public.listings VALUES (51, 'Necklace', 'Elegant jewelry to complete your look.', 'Politekhnichnyi Ln, 2, Zhytomyr, Zhytomyrs''ka oblast, Ukraine, 10001', 9.7, '10001', 'Zhytomyr', 50.244118, 28.634174, 1184.5096, NULL, NULL, true, 29, NULL, true, '2025-08-17 21:25:36.45898+02', '2025-08-17 21:25:36.45898+02', 26);


--
-- TOC entry 5183 (class 0 OID 962095)
-- Dependencies: 232
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.logs VALUES (1, false, 'LOGS_TABLE is not defined', 'ReferenceError: LOGS_TABLE is not defined
    at totalCount (E:\dyplome\new-restart\server\models\disputePredictionModel.js:85:29)
    at DisputePredictionModelController.baseList (E:\dyplome\new-restart\server\controllers\Controller.js:445:28)
    at DisputePredictionModelController.baseDisputePredictionModelList (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:59:48)
    at E:\dyplome\new-restart\server\controllers\MainController.js:168:53
    at MainController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at getAdminDisputePredictionModelListPageOptions (E:\dyplome\new-restart\server\controllers\MainController.js:166:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at isAdmin (E:\dyplome\new-restart\server\middlewares\isAdmin.js:14:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)', '85', '29)', 'totalCount (E:\dyplome\new-restart\server\models\disputePredictionModel.js', '2025-07-15 20:49:21.650515+02', '2025-07-15 20:49:21.650515+02');
INSERT INTO public.logs VALUES (2, false, 'ACTIVE_ACTION_TABLE is not defined', 'ReferenceError: ACTIVE_ACTION_TABLE is not defined
    at DisputePrediction.getDetailsById (E:\dyplome\new-restart\server\models\disputePredictionModel.js:80:30)
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:36:54
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '80', '30)', 'DisputePrediction.getDetailsById (E:\dyplome\new-restart\server\models\disputePredictionModel.js', '2025-07-15 21:20:58.866952+02', '2025-07-15 21:20:58.866952+02');
INSERT INTO public.logs VALUES (3, false, 'select "data" from "dispute_prediction_models" where "id" = $1 - column "data" does not exist', 'error: select "data" from "dispute_prediction_models" where "id" = $1 - column "data" does not exist
    at Parser.parseErrorMessage (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js:283:98)
    at Parser.handlePacket (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js:122:29)
    at Parser.parse (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js:35:38)
    at Socket.<anonymous> (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\index.js:11:42)
    at Socket.emit (node:events:518:28)
    at addChunk (node:internal/streams/readable:561:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
    at Readable.push (node:internal/streams/readable:392:5)
    at TCP.onStreamRead (node:internal/stream_base_commons:189:23)', '283', '98)', 'Parser.parseErrorMessage (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js', '2025-07-15 21:21:18.300395+02', '2025-07-15 21:21:18.300395+02');
INSERT INTO public.logs VALUES (4, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:75:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:74:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '75', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:39:50.841593+02', '2025-07-15 21:39:50.841593+02');
INSERT INTO public.logs VALUES (5, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:75:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:74:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '75', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:39:54.592447+02', '2025-07-15 21:39:54.592447+02');
INSERT INTO public.logs VALUES (27, false, '', 'AggregateError
    at AxiosError.from (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:876:14)
    at RedirectableRequest.handleRequestError (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3156:25)
    at RedirectableRequest.emit (node:events:518:28)
    at eventHandlers.<computed> (E:\dyplome\new-restart\server\node_modules\follow-redirects\index.js:49:24)
    at ClientRequest.emit (node:events:518:28)
    at emitErrorEvent (node:_http_client:104:11)
    at Socket.socketErrorListener (node:_http_client:518:5)
    at Socket.emit (node:events:518:28)
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async checkModelQuery (E:\dyplome\new-restart\server\services\forestServerRequests.js:18:20)
    at async E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:67:28
    at async DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-08 20:14:38.947693+02', '2025-08-08 20:14:38.947693+02');
INSERT INTO public.logs VALUES (6, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:75:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:74:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '75', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:39:57.459829+02', '2025-07-15 21:39:57.459829+02');
INSERT INTO public.logs VALUES (7, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:75:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:74:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '75', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:39:59.272451+02', '2025-07-15 21:39:59.272451+02');
INSERT INTO public.logs VALUES (8, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:75:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:74:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '75', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:40:00.606954+02', '2025-07-15 21:40:00.606954+02');
INSERT INTO public.logs VALUES (9, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:75:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:74:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '75', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:40:04.365377+02', '2025-07-15 21:40:04.365377+02');
INSERT INTO public.logs VALUES (10, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:75:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:74:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '75', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:40:09.089005+02', '2025-07-15 21:40:09.089005+02');
INSERT INTO public.logs VALUES (11, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:75:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:74:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '75', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:40:13.525514+02', '2025-07-15 21:40:13.525514+02');
INSERT INTO public.logs VALUES (12, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:75:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:74:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '75', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:40:15.870233+02', '2025-07-15 21:40:15.870233+02');
INSERT INTO public.logs VALUES (13, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:75:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:74:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '75', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:40:27.59055+02', '2025-07-15 21:40:27.59055+02');
INSERT INTO public.logs VALUES (14, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:78:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:77:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '78', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:45:19.031443+02', '2025-07-15 21:45:19.031443+02');
INSERT INTO public.logs VALUES (15, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:78:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:77:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '78', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:45:20.609338+02', '2025-07-15 21:45:20.609338+02');
INSERT INTO public.logs VALUES (16, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:78:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:77:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '78', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:47:25.504125+02', '2025-07-15 21:47:25.504125+02');
INSERT INTO public.logs VALUES (17, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:78:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:77:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '78', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:47:31.858395+02', '2025-07-15 21:47:31.858395+02');
INSERT INTO public.logs VALUES (18, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:78:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:77:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '78', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:47:36.646227+02', '2025-07-15 21:47:36.646227+02');
INSERT INTO public.logs VALUES (19, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:78:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:77:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '78', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:47:46.057288+02', '2025-07-15 21:47:46.057288+02');
INSERT INTO public.logs VALUES (20, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:78:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:77:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '78', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:47:54.632886+02', '2025-07-15 21:47:54.632886+02');
INSERT INTO public.logs VALUES (21, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:78:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:77:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '78', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:48:00.448425+02', '2025-07-15 21:48:00.448425+02');
INSERT INTO public.logs VALUES (22, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:78:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:77:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '78', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:48:22.723793+02', '2025-07-15 21:48:22.723793+02');
INSERT INTO public.logs VALUES (23, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:78:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:77:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '78', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:48:26.764934+02', '2025-07-15 21:48:26.764934+02');
INSERT INTO public.logs VALUES (24, false, 'update "dispute_prediction_models" set "active" = $1, "rebuild" = $2 where "id" = $3 - column "rebuild" of relation "dispute_prediction_models" does not exist', 'error: update "dispute_prediction_models" set "active" = $1, "rebuild" = $2 where "id" = $3 - column "rebuild" of relation "dispute_prediction_models" does not exist
    at Parser.parseErrorMessage (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js:283:98)
    at Parser.handlePacket (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js:122:29)
    at Parser.parse (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js:35:38)
    at Socket.<anonymous> (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\index.js:11:42)
    at Socket.emit (node:events:518:28)
    at addChunk (node:internal/streams/readable:561:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
    at Readable.push (node:internal/streams/readable:392:5)
    at TCP.onStreamRead (node:internal/stream_base_commons:189:23)', '283', '98)', 'Parser.parseErrorMessage (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js', '2025-07-15 21:48:31.761316+02', '2025-07-15 21:48:31.761316+02');
INSERT INTO public.logs VALUES (25, false, 'this.baseLogList is not a function', 'TypeError: this.baseLogList is not a function
    at E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:78:33
    at DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:13)
    at list (E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:77:10)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (E:\dyplome\new-restart\server\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)
    at next (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:175:3)
    at router (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:47:12)
    at Layer.handle [as handle_request] (E:\dyplome\new-restart\server\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:328:13)
    at E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (E:\dyplome\new-restart\server\node_modules\express\lib\router\index.js:346:12)', '78', '33', 'E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js', '2025-07-15 21:49:07.398037+02', '2025-07-15 21:49:07.398037+02');
INSERT INTO public.logs VALUES (26, false, '', 'AggregateError
    at AxiosError.from (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:876:14)
    at RedirectableRequest.handleRequestError (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3156:25)
    at RedirectableRequest.emit (node:events:518:28)
    at eventHandlers.<computed> (E:\dyplome\new-restart\server\node_modules\follow-redirects\index.js:49:24)
    at ClientRequest.emit (node:events:518:28)
    at emitErrorEvent (node:_http_client:104:11)
    at Socket.socketErrorListener (node:_http_client:518:5)
    at Socket.emit (node:events:518:28)
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async checkModelQuery (E:\dyplome\new-restart\server\services\forestServerRequests.js:18:20)
    at async E:\dyplome\new-restart\server\controllers\DisputePredictionModelController.js:67:28
    at async DisputePredictionModelController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-08 20:14:31.637726+02', '2025-08-08 20:14:31.637726+02');
INSERT INTO public.logs VALUES (28, false, 'Request failed with status code 500', 'AxiosError: Request failed with status code 500
    at settle (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:2019:12)
    at IncomingMessage.handleStreamEnd (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3135:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:217:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-10 12:08:09.224218+02', '2025-08-10 12:08:09.224218+02');
INSERT INTO public.logs VALUES (29, false, 'Request failed with status code 500', 'AxiosError: Request failed with status code 500
    at settle (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:2019:12)
    at IncomingMessage.handleStreamEnd (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3135:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:217:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-10 12:08:12.389957+02', '2025-08-10 12:08:12.389957+02');
INSERT INTO public.logs VALUES (30, false, 'Request failed with status code 500', 'AxiosError: Request failed with status code 500
    at settle (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:2019:12)
    at IncomingMessage.handleStreamEnd (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3135:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:217:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-10 12:11:51.103101+02', '2025-08-10 12:11:51.103101+02');
INSERT INTO public.logs VALUES (31, false, 'Request failed with status code 500', 'AxiosError: Request failed with status code 500
    at settle (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:2019:12)
    at IncomingMessage.handleStreamEnd (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3135:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:217:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-10 12:12:20.919422+02', '2025-08-10 12:12:20.919422+02');
INSERT INTO public.logs VALUES (32, false, 'Request failed with status code 500', 'AxiosError: Request failed with status code 500
    at settle (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:2019:12)
    at IncomingMessage.handleStreamEnd (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3135:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:217:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-10 12:13:08.910261+02', '2025-08-10 12:13:08.910261+02');
INSERT INTO public.logs VALUES (33, false, 'Request failed with status code 500', 'AxiosError: Request failed with status code 500
    at settle (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:2019:12)
    at IncomingMessage.handleStreamEnd (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3135:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:217:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-10 12:16:46.07129+02', '2025-08-10 12:16:46.07129+02');
INSERT INTO public.logs VALUES (34, false, 'Request failed with status code 500', 'AxiosError: Request failed with status code 500
    at settle (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:2019:12)
    at IncomingMessage.handleStreamEnd (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3135:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:217:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-10 12:18:18.174158+02', '2025-08-10 12:18:18.174158+02');
INSERT INTO public.logs VALUES (35, false, 'Request failed with status code 500', 'AxiosError: Request failed with status code 500
    at settle (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:2019:12)
    at IncomingMessage.handleStreamEnd (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3135:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:217:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-10 12:19:28.369795+02', '2025-08-10 12:19:28.369795+02');
INSERT INTO public.logs VALUES (36, false, 'Request failed with status code 500', 'AxiosError: Request failed with status code 500
    at settle (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:2019:12)
    at IncomingMessage.handleStreamEnd (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3135:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:217:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-10 12:23:52.374681+02', '2025-08-10 12:23:52.374681+02');
INSERT INTO public.logs VALUES (37, false, 'Request failed with status code 500', 'AxiosError: Request failed with status code 500
    at settle (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:2019:12)
    at IncomingMessage.handleStreamEnd (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3135:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:217:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-10 12:28:57.32124+02', '2025-08-10 12:28:57.32124+02');
INSERT INTO public.logs VALUES (38, false, 'Request failed with status code 500', 'AxiosError: Request failed with status code 500
    at settle (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:2019:12)
    at IncomingMessage.handleStreamEnd (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3135:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:217:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-10 12:30:57.036176+02', '2025-08-10 12:30:57.036176+02');
INSERT INTO public.logs VALUES (39, false, 'Request failed with status code 500', 'AxiosError: Request failed with status code 500
    at settle (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:2019:12)
    at IncomingMessage.handleStreamEnd (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3135:11)
    at IncomingMessage.emit (node:events:530:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:217:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-10 12:31:52.974413+02', '2025-08-10 12:31:52.974413+02');
INSERT INTO public.logs VALUES (40, false, '', 'AggregateError
    at AxiosError.from (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:876:14)
    at RedirectableRequest.handleRequestError (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:3156:25)
    at RedirectableRequest.emit (node:events:518:28)
    at eventHandlers.<computed> (E:\dyplome\new-restart\server\node_modules\follow-redirects\index.js:49:24)
    at ClientRequest.emit (node:events:518:28)
    at emitErrorEvent (node:_http_client:104:11)
    at Socket.socketErrorListener (node:_http_client:518:5)
    at Socket.emit (node:events:518:28)
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at Axios.request (E:\dyplome\new-restart\server\node_modules\axios\dist\node\axios.cjs:4287:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async predictTempOrderDispute (E:\dyplome\new-restart\server\services\forestServerRequests.js:46:20)
    at async E:\dyplome\new-restart\server\controllers\OrderController.js:220:22
    at async OrderController.baseWrapper (E:\dyplome\new-restart\server\controllers\Controller.js:184:7)', '-', '-', '-', '2025-08-18 17:21:50.939062+02', '2025-08-18 17:21:50.939062+02');
INSERT INTO public.logs VALUES (41, false, 'select "order_update_requests"."id", "order_update_requests"."fee" as "newFee", "order_update_requests"."sender_id" as "senderId", "order_update_requests"."order_id" as "orderId", "order_update_requests"."active", "order_update_requests"."created_at" as "createdAt", "order_update_requests"."new_price" as "newPrice", "order_update_requests"."new_start_time" as "newStartDate", "order_update_requests"."new_finish_time" as "newFinishDate" from "order_update_requests" where "order_id" = $1 and "active" = $2 limit $3 - column order_update_requests.fee does not exist', 'error: select "order_update_requests"."id", "order_update_requests"."fee" as "newFee", "order_update_requests"."sender_id" as "senderId", "order_update_requests"."order_id" as "orderId", "order_update_requests"."active", "order_update_requests"."created_at" as "createdAt", "order_update_requests"."new_price" as "newPrice", "order_update_requests"."new_start_time" as "newStartDate", "order_update_requests"."new_finish_time" as "newFinishDate" from "order_update_requests" where "order_id" = $1 and "active" = $2 limit $3 - column order_update_requests.fee does not exist
    at Parser.parseErrorMessage (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js:283:98)
    at Parser.handlePacket (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js:122:29)
    at Parser.parse (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js:35:38)
    at Socket.<anonymous> (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\index.js:11:42)
    at Socket.emit (node:events:518:28)
    at addChunk (node:internal/streams/readable:561:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
    at Readable.push (node:internal/streams/readable:392:5)
    at TCP.onStreamRead (node:internal/stream_base_commons:189:23)', '283', '98)', 'Parser.parseErrorMessage (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js', '2025-08-18 17:56:03.666737+02', '2025-08-18 17:56:03.666737+02');
INSERT INTO public.logs VALUES (42, false, 'select "orders"."id" as "orderId", "orders"."price_per_day" as "pricePerDay", "orders"."start_time" as "startDate", "orders"."finish_time" as "finishDate", "sender_payments"."type" as "type", "sender_payments"."type" as "transactionId", "sender_payments"."created_at" as "createdAt" from "sender_payments" inner join "orders" on "orders"."id" = "sender_payments"."order_id" where "status" in ($1) and "admin_approved" = $2 and "sender_payments"."created_at" >= $3 and "sender_payments"."created_at" <= $4 and "sender_payments"."hidden" = $5 and "sender_payments"."user_id" = $6 - column orders.price_per_day does not exist', 'error: select "orders"."id" as "orderId", "orders"."price_per_day" as "pricePerDay", "orders"."start_time" as "startDate", "orders"."finish_time" as "finishDate", "sender_payments"."type" as "type", "sender_payments"."type" as "transactionId", "sender_payments"."created_at" as "createdAt" from "sender_payments" inner join "orders" on "orders"."id" = "sender_payments"."order_id" where "status" in ($1) and "admin_approved" = $2 and "sender_payments"."created_at" >= $3 and "sender_payments"."created_at" <= $4 and "sender_payments"."hidden" = $5 and "sender_payments"."user_id" = $6 - column orders.price_per_day does not exist
    at Parser.parseErrorMessage (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js:283:98)
    at Parser.handlePacket (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js:122:29)
    at Parser.parse (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js:35:38)
    at Socket.<anonymous> (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\index.js:11:42)
    at Socket.emit (node:events:518:28)
    at addChunk (node:internal/streams/readable:561:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
    at Readable.push (node:internal/streams/readable:392:5)
    at TCP.onStreamRead (node:internal/stream_base_commons:189:23)', '283', '98)', 'Parser.parseErrorMessage (E:\dyplome\new-restart\server\node_modules\pg-protocol\dist\parser.js', '2025-08-18 19:02:12.367791+02', '2025-08-18 19:02:12.367791+02');


--
-- TOC entry 5205 (class 0 OID 962276)
-- Dependencies: 254
-- Data for Name: order_update_requests; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.order_update_requests VALUES (1, false, 5.2, '2025-08-18 23:00:00+02', '2025-08-17 23:00:00+02', '2025-08-18 18:39:35.760752+02', '2025-08-18 18:39:35.760752+02', 3, 5);
INSERT INTO public.order_update_requests VALUES (2, false, 6.06, '2025-09-04 23:00:00+02', '2025-08-30 23:00:00+02', '2025-08-18 18:54:14.978797+02', '2025-08-18 18:54:14.978797+02', 6, 7);
INSERT INTO public.order_update_requests VALUES (3, false, 6.12, '2025-08-28 23:00:00+02', '2025-08-28 23:00:00+02', '2025-08-18 19:09:02.073804+02', '2025-08-18 19:09:02.073804+02', 6, 9);
INSERT INTO public.order_update_requests VALUES (4, false, 6.12, '2025-08-29 23:00:00+02', '2025-08-29 23:00:00+02', '2025-08-18 19:09:18.144633+02', '2025-08-18 19:09:18.144633+02', 4, 9);
INSERT INTO public.order_update_requests VALUES (5, false, 5.2, '2025-09-05 23:00:00+02', '2025-09-04 23:00:00+02', '2025-08-18 19:15:39.593651+02', '2025-08-18 19:15:39.593651+02', 3, 12);
INSERT INTO public.order_update_requests VALUES (6, false, 5.2, '2025-09-05 23:00:00+02', '2025-09-05 23:00:00+02', '2025-08-18 19:15:53.996452+02', '2025-08-18 19:15:53.996452+02', 4, 12);
INSERT INTO public.order_update_requests VALUES (7, false, 5.2, '2025-09-11 23:00:00+02', '2025-09-07 23:00:00+02', '2025-08-19 17:29:28.231509+02', '2025-08-19 17:29:28.231509+02', 3, 14);
INSERT INTO public.order_update_requests VALUES (8, false, 5.2, '2025-08-28 23:00:00+02', '2025-08-25 23:00:00+02', '2025-08-19 17:37:54.001177+02', '2025-08-19 17:37:54.001177+02', 3, 15);
INSERT INTO public.order_update_requests VALUES (9, false, 5.2, '2025-08-21 23:00:00+02', '2025-08-18 23:00:00+02', '2025-08-19 17:38:05.145284+02', '2025-08-19 17:38:05.145284+02', 5, 15);
INSERT INTO public.order_update_requests VALUES (10, false, 9.76, '2025-08-19 23:00:00+02', '2025-08-19 23:00:00+02', '2025-08-19 17:45:39.712766+02', '2025-08-19 17:45:39.712766+02', 3, 16);
INSERT INTO public.order_update_requests VALUES (11, false, 9.76, '2025-08-20 23:00:00+02', '2025-08-20 23:00:00+02', '2025-08-19 17:45:54.742555+02', '2025-08-19 17:45:54.742555+02', 8, 16);
INSERT INTO public.order_update_requests VALUES (12, false, 7.8, '2025-09-04 23:00:00+02', '2025-08-25 23:00:00+02', '2025-08-19 17:52:42.175784+02', '2025-08-19 17:52:42.175784+02', 16, 18);
INSERT INTO public.order_update_requests VALUES (13, false, 8.81, '2025-09-11 23:00:00+02', '2025-09-08 23:00:00+02', '2025-08-19 18:04:28.860869+02', '2025-08-19 18:04:28.860869+02', 10, 21);
INSERT INTO public.order_update_requests VALUES (14, false, 5.07, '2025-08-26 23:00:00+02', '2025-08-26 23:00:00+02', '2025-08-19 18:35:02.818328+02', '2025-08-19 18:35:02.818328+02', 12, 31);
INSERT INTO public.order_update_requests VALUES (15, false, 5.07, '2025-09-02 23:00:00+02', '2025-09-02 23:00:00+02', '2025-08-19 18:35:15.574964+02', '2025-08-19 18:35:15.574964+02', 13, 31);
INSERT INTO public.order_update_requests VALUES (16, false, 8.8, '2025-08-27 23:00:00+02', '2025-08-25 23:00:00+02', '2025-08-19 19:06:27.301068+02', '2025-08-19 19:06:27.301068+02', 12, 38);
INSERT INTO public.order_update_requests VALUES (17, false, 5, '2025-09-03 23:00:00+02', '2025-09-01 23:00:00+02', '2025-08-19 19:06:33.046826+02', '2025-08-19 19:06:33.046826+02', 12, 39);
INSERT INTO public.order_update_requests VALUES (19, false, 5, '2025-09-01 23:00:00+02', '2025-08-25 23:00:00+02', '2025-08-19 19:10:01.773983+02', '2025-08-19 19:10:01.773983+02', 12, 40);
INSERT INTO public.order_update_requests VALUES (18, false, 5, '2025-09-05 23:00:00+02', '2025-08-18 23:00:00+02', '2025-08-19 19:09:54.289801+02', '2025-08-19 19:09:54.289801+02', 12, 41);
INSERT INTO public.order_update_requests VALUES (21, false, 5, '2025-10-10 23:00:00+02', '2025-09-22 23:00:00+02', '2025-08-19 19:10:24.845294+02', '2025-08-19 19:10:24.845294+02', 14, 41);
INSERT INTO public.order_update_requests VALUES (20, false, 5, '2025-09-08 23:00:00+02', '2025-09-01 23:00:00+02', '2025-08-19 19:10:11.6879+02', '2025-08-19 19:10:11.6879+02', 13, 40);
INSERT INTO public.order_update_requests VALUES (22, false, 7.2, '2025-09-02 23:00:00+02', '2025-09-02 23:00:00+02', '2025-08-19 19:16:39.392408+02', '2025-08-19 19:16:39.392408+02', 10, 42);
INSERT INTO public.order_update_requests VALUES (23, false, 5, '2025-09-03 23:00:00+02', '2025-08-30 23:00:00+02', '2025-08-19 19:19:09.005712+02', '2025-08-19 19:19:09.005712+02', 10, 44);
INSERT INTO public.order_update_requests VALUES (24, false, 5, '2025-08-25 23:00:00+02', '2025-08-23 23:00:00+02', '2025-08-19 19:19:22.939943+02', '2025-08-19 19:19:22.939943+02', 14, 44);
INSERT INTO public.order_update_requests VALUES (25, false, 5, '2025-09-10 23:00:00+02', '2025-09-06 23:00:00+02', '2025-08-19 19:19:32.292374+02', '2025-08-19 19:19:32.292374+02', 10, 44);
INSERT INTO public.order_update_requests VALUES (27, false, 6.06, '2025-09-08 23:00:00+02', '2025-09-08 23:00:00+02', '2025-08-19 19:30:49.07441+02', '2025-08-19 19:30:49.07441+02', 6, 46);
INSERT INTO public.order_update_requests VALUES (26, false, 6.06, '2025-09-01 23:00:00+02', '2025-09-01 23:00:00+02', '2025-08-19 19:30:43.563392+02', '2025-08-19 19:30:43.563392+02', 6, 47);
INSERT INTO public.order_update_requests VALUES (29, false, 6.06, '2025-08-18 23:00:00+02', '2025-08-18 23:00:00+02', '2025-08-19 19:31:09.843+02', '2025-08-19 19:31:09.843+02', 14, 47);
INSERT INTO public.order_update_requests VALUES (28, false, 6.06, '2025-08-25 23:00:00+02', '2025-08-25 23:00:00+02', '2025-08-19 19:30:59.671316+02', '2025-08-19 19:30:59.671316+02', 13, 46);


--
-- TOC entry 5203 (class 0 OID 962254)
-- Dependencies: 252
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.orders VALUES (1, 'pending_owner', NULL, 10, '2025-08-09 23:00:00+02', '2025-08-13 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:44:29.612187+02', '2025-08-10 12:44:29.612187+02', 2, 1, 50);
INSERT INTO public.orders VALUES (25, 'in_process', NULL, 5, '2025-09-01 23:00:00+02', '2025-09-05 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:15:33.486944+02', '2025-08-19 18:15:33.486944+02', 9, 7, 0);
INSERT INTO public.orders VALUES (2, 'finished', NULL, 5.74, '2025-08-17 23:00:00+02', '2025-08-22 23:00:00+02', NULL, NULL, NULL, 15, 15, '2025-08-18 18:10:12.054207+02', '2025-08-18 17:31:01.381133+02', '2025-08-18 17:31:01.381133+02', 4, 24, 0);
INSERT INTO public.orders VALUES (32, 'in_process', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-22 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:40:32.99923+02', '2025-08-19 18:40:32.99923+02', 14, 32, 0);
INSERT INTO public.orders VALUES (15, 'in_process', NULL, 5.2, '2025-08-21 23:00:00+02', '2025-08-18 23:00:00+02', 5.2, '2025-09-29 23:00:00+02', '2025-10-03 23:00:00+02', 15, 15, NULL, '2025-08-19 17:34:56.773104+02', '2025-08-19 17:34:56.773104+02', 5, 23, 0);
INSERT INTO public.orders VALUES (3, 'finished', NULL, 5, '2025-08-17 23:00:00+02', '2025-08-22 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:28:45.472187+02', '2025-08-18 18:28:45.472187+02', 4, 48, 0);
INSERT INTO public.orders VALUES (24, 'finished', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-21 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:15:20.674028+02', '2025-08-19 18:15:20.674028+02', 11, 7, 0);
INSERT INTO public.orders VALUES (4, 'in_process', NULL, 5, '2025-08-23 23:00:00+02', '2025-08-24 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:36:30.003049+02', '2025-08-18 18:36:30.003049+02', 4, 48, 0);
INSERT INTO public.orders VALUES (33, 'pending_owner_finished', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-21 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:40:40.272254+02', '2025-08-19 18:40:40.272254+02', 13, 32, 0);
INSERT INTO public.orders VALUES (5, 'pending_owner_finished', NULL, 5.2, '2025-08-18 23:00:00+02', '2025-08-17 23:00:00+02', 5.2, '2025-08-17 23:00:00+02', '2025-09-05 23:00:00+02', 15, 15, NULL, '2025-08-18 18:39:23.340308+02', '2025-08-18 18:39:23.340308+02', 4, 23, 0);
INSERT INTO public.orders VALUES (16, 'finished', NULL, 9.76, '2025-08-20 23:00:00+02', '2025-08-20 23:00:00+02', 9.76, '2025-08-19 17:45:00+02', '2025-08-19 17:45:00+02', 15, 15, NULL, '2025-08-19 17:45:21.30598+02', '2025-08-19 17:45:21.30598+02', 8, 19, 0);
INSERT INTO public.orders VALUES (6, 'finished', NULL, 5, '2025-08-17 23:00:00+02', '2025-08-17 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:43:31.09923+02', '2025-08-18 18:43:31.09923+02', 4, 6, 0);
INSERT INTO public.orders VALUES (26, 'finished', NULL, 8.8, '2025-08-18 23:00:00+02', '2025-08-19 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:26:42.268262+02', '2025-08-19 18:26:42.268262+02', 13, 37, 0);
INSERT INTO public.orders VALUES (7, 'in_process', NULL, 6.06, '2025-09-04 23:00:00+02', '2025-08-30 23:00:00+02', 6.06, '2025-08-17 23:00:00+02', '2025-08-29 23:00:00+02', 15, 15, NULL, '2025-08-18 18:53:53.231661+02', '2025-08-18 18:53:53.231661+02', 4, 26, 0);
INSERT INTO public.orders VALUES (17, 'finished', NULL, 8.7, '2025-08-18 23:00:00+02', '2025-08-22 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 17:49:16.358557+02', '2025-08-19 17:49:16.358557+02', 8, 3, 0);
INSERT INTO public.orders VALUES (8, 'finished', NULL, 6.12, '2025-08-30 23:00:00+02', '2025-09-05 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:06:52.809868+02', '2025-08-18 19:06:52.809868+02', 4, 25, 0);
INSERT INTO public.orders VALUES (38, 'finished', NULL, 8.8, '2025-08-27 23:00:00+02', '2025-08-25 23:00:00+02', 8.8, '2025-08-18 23:00:00+02', '2025-08-20 23:00:00+02', 15, 15, NULL, '2025-08-19 19:05:49.959385+02', '2025-08-19 19:05:49.959385+02', 13, 37, 0);
INSERT INTO public.orders VALUES (27, 'finished', NULL, 8.95, '2025-08-18 23:00:00+02', '2025-09-05 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:30:12.063528+02', '2025-08-19 18:30:12.063528+02', 14, 18, 0);
INSERT INTO public.orders VALUES (9, 'in_process', NULL, 6.12, '2025-08-29 23:00:00+02', '2025-08-29 23:00:00+02', 6.12, '2025-08-18 19:08:00+02', '2025-08-18 19:08:00+02', 15, 15, NULL, '2025-08-18 19:08:47.591727+02', '2025-08-18 19:08:47.591727+02', 4, 25, 0);
INSERT INTO public.orders VALUES (18, 'pending_owner_finished', NULL, 7.8, '2025-09-04 23:00:00+02', '2025-08-25 23:00:00+02', 7.8, '2025-08-18 23:00:00+02', '2025-08-28 23:00:00+02', 15, 15, NULL, '2025-08-19 17:52:24.25133+02', '2025-08-19 17:52:24.25133+02', 5, 11, 0);
INSERT INTO public.orders VALUES (10, 'pending_owner_finished', NULL, 5.2, '2025-08-17 23:00:00+02', '2025-08-29 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:11:21.03935+02', '2025-08-18 19:11:21.03935+02', 4, 23, 0);
INSERT INTO public.orders VALUES (19, 'in_process', NULL, 7.2, '2025-08-18 23:00:00+02', '2025-08-21 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:00:59.644163+02', '2025-08-19 18:00:59.644163+02', 9, 31, 0);
INSERT INTO public.orders VALUES (11, 'pending_owner_finished', NULL, 9.76, '2025-08-17 23:00:00+02', '2025-08-17 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:13:42.426387+02', '2025-08-18 19:13:42.426387+02', 4, 19, 0);
INSERT INTO public.orders VALUES (35, 'in_process', NULL, 5, '2025-08-26 23:00:00+02', '2025-08-28 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:43:03.038763+02', '2025-08-19 18:43:03.038763+02', 13, 32, 0);
INSERT INTO public.orders VALUES (20, 'in_process', NULL, 7.2, '2025-08-25 23:00:00+02', '2025-08-27 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:02:16.136687+02', '2025-08-19 18:02:16.136687+02', 11, 31, 0);
INSERT INTO public.orders VALUES (12, 'in_process', NULL, 5.2, '2025-09-05 23:00:00+02', '2025-09-05 23:00:00+02', 5.2, '2025-08-30 23:00:00+02', '2025-08-30 23:00:00+02', 15, 15, NULL, '2025-08-18 19:14:52.493644+02', '2025-08-18 19:14:52.493644+02', 4, 23, 0);
INSERT INTO public.orders VALUES (34, 'in_process', NULL, 5, '2025-08-24 23:00:00+02', '2025-08-27 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:42:48.091129+02', '2025-08-19 18:42:48.091129+02', 14, 32, 0);
INSERT INTO public.orders VALUES (13, 'pending_owner_finished', NULL, 5.2, '2025-09-17 23:00:00+02', '2025-09-17 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:26:31.733882+02', '2025-08-18 19:26:31.733882+02', 4, 23, 0);
INSERT INTO public.orders VALUES (21, 'in_process', NULL, 8.81, '2025-09-11 23:00:00+02', '2025-09-08 23:00:00+02', 8.81, '2025-09-01 23:00:00+02', '2025-09-04 23:00:00+02', 15, 15, NULL, '2025-08-19 18:04:10.706942+02', '2025-08-19 18:04:10.706942+02', 9, 29, 0);
INSERT INTO public.orders VALUES (14, 'in_process', NULL, 5.2, '2025-09-11 23:00:00+02', '2025-09-07 23:00:00+02', 5.2, '2025-08-31 23:00:00+02', '2025-09-04 23:00:00+02', 15, 15, NULL, '2025-08-19 17:29:11.238763+02', '2025-08-19 17:29:11.238763+02', 5, 23, 0);
INSERT INTO public.orders VALUES (28, 'finished', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-21 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:31:00.328916+02', '2025-08-19 18:31:00.328916+02', 13, 36, 0);
INSERT INTO public.orders VALUES (22, 'pending_owner_finished', NULL, 7.6, '2025-08-25 23:00:00+02', '2025-08-28 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:05:34.842003+02', '2025-08-19 18:05:34.842003+02', 11, 43, 0);
INSERT INTO public.orders VALUES (39, 'finished', NULL, 5, '2025-09-03 23:00:00+02', '2025-09-01 23:00:00+02', 5, '2025-08-18 23:00:00+02', '2025-08-20 23:00:00+02', 15, 15, NULL, '2025-08-19 19:06:07.664541+02', '2025-08-19 19:06:07.664541+02', 14, 36, 0);
INSERT INTO public.orders VALUES (29, 'pending_owner_finished', NULL, 5.07, '2025-08-18 23:00:00+02', '2025-08-26 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:32:14.47262+02', '2025-08-19 18:32:14.47262+02', 13, 14, 0);
INSERT INTO public.orders VALUES (23, 'finished', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-21 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:10:56.027243+02', '2025-08-19 18:10:56.027243+02', 9, 28, 0);
INSERT INTO public.orders VALUES (37, 'in_process', NULL, 5, '2025-09-03 23:00:00+02', '2025-09-05 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:44:20.436629+02', '2025-08-19 18:44:20.436629+02', 13, 32, 0);
INSERT INTO public.orders VALUES (30, 'in_process', NULL, 5.07, '2025-09-01 23:00:00+02', '2025-09-04 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:33:27.63562+02', '2025-08-19 18:33:27.63562+02', 14, 14, 0);
INSERT INTO public.orders VALUES (48, 'finished', NULL, 6.06, '2025-08-19 19:32:00+02', '2025-08-19 19:32:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:32:49.556667+02', '2025-08-19 19:32:49.556667+02', 13, 26, 0);
INSERT INTO public.orders VALUES (36, 'finished', NULL, 5, '2025-09-02 23:00:00+02', '2025-09-03 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:44:14.476499+02', '2025-08-19 18:44:14.476499+02', 14, 32, 0);
INSERT INTO public.orders VALUES (31, 'in_process', NULL, 5.07, '2025-09-02 23:00:00+02', '2025-09-02 23:00:00+02', 5.07, '2025-08-19 18:34:00+02', '2025-08-19 18:34:00+02', 15, 15, NULL, '2025-08-19 18:34:39.217984+02', '2025-08-19 18:34:39.217984+02', 13, 14, 0);
INSERT INTO public.orders VALUES (45, 'finished', NULL, 7.6, '2025-08-18 23:00:00+02', '2025-08-18 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:20:56.616343+02', '2025-08-19 19:20:56.616343+02', 14, 43, 0);
INSERT INTO public.orders VALUES (42, 'in_process', NULL, 7.2, '2025-09-02 23:00:00+02', '2025-09-02 23:00:00+02', 7.2, '2025-08-19 19:15:00+02', '2025-08-19 19:15:00+02', 15, 15, NULL, '2025-08-19 19:15:36.926787+02', '2025-08-19 19:15:36.926787+02', 13, 31, 0);
INSERT INTO public.orders VALUES (43, 'in_process', NULL, 7.61, '2025-09-05 23:00:00+02', '2025-09-05 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:16:27.629992+02', '2025-08-19 19:16:27.629992+02', 14, 16, 0);
INSERT INTO public.orders VALUES (47, 'finished', NULL, 6.06, '2025-08-18 23:00:00+02', '2025-08-18 23:00:00+02', 6.06, '2025-08-25 23:00:00+02', '2025-08-25 23:00:00+02', 15, 15, NULL, '2025-08-19 19:30:32.065465+02', '2025-08-19 19:30:32.065465+02', 14, 26, 0);
INSERT INTO public.orders VALUES (44, 'pending_owner_finished', NULL, 5, '2025-09-10 23:00:00+02', '2025-09-06 23:00:00+02', 5, '2025-08-23 23:00:00+02', '2025-08-27 23:00:00+02', 15, 15, NULL, '2025-08-19 19:18:57.045791+02', '2025-08-19 19:18:57.045791+02', 14, 28, 0);
INSERT INTO public.orders VALUES (41, 'finished', NULL, 5, '2025-10-10 23:00:00+02', '2025-09-22 23:00:00+02', 5, '2025-08-18 23:00:00+02', '2025-09-05 23:00:00+02', 15, 15, NULL, '2025-08-19 19:09:45.070314+02', '2025-08-19 19:09:45.070314+02', 14, 36, 0);
INSERT INTO public.orders VALUES (40, 'finished', NULL, 5, '2025-09-08 23:00:00+02', '2025-09-01 23:00:00+02', 5, '2025-08-18 23:00:00+02', '2025-08-25 23:00:00+02', 15, 15, NULL, '2025-08-19 19:09:33.920005+02', '2025-08-19 19:09:33.920005+02', 13, 36, 0);
INSERT INTO public.orders VALUES (51, 'finished', NULL, 5, '2025-08-31 23:00:00+02', '2025-11-30 00:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:38:19.49504+02', '2025-08-19 19:38:19.49504+02', 1, 6, 0);
INSERT INTO public.orders VALUES (49, 'pending_owner_finished', NULL, 6.06, '2025-08-19 19:32:00+02', '2025-08-19 19:32:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:33:00.698463+02', '2025-08-19 19:33:00.698463+02', 14, 26, 0);
INSERT INTO public.orders VALUES (46, 'in_process', NULL, 6.06, '2025-08-25 23:00:00+02', '2025-08-25 23:00:00+02', 6.06, '2025-08-18 23:00:00+02', '2025-08-18 23:00:00+02', 15, 15, NULL, '2025-08-19 19:30:22.668293+02', '2025-08-19 19:30:22.668293+02', 13, 26, 0);
INSERT INTO public.orders VALUES (50, 'in_process', NULL, 5, '2025-09-30 23:00:00+02', '2025-12-31 00:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:38:06.525137+02', '2025-08-19 19:38:06.525137+02', 13, 6, 0);


--
-- TOC entry 5229 (class 0 OID 962501)
-- Dependencies: 278
-- Data for Name: owner_comments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.owner_comments VALUES (1, 'cool', 'cool', 2, 5, 1, 2, 3, 4, 2, 3, false, true, '', '2025-08-18 18:32:13.593842+02', '2025-08-18 18:32:13.593842+02', 3);


--
-- TOC entry 5175 (class 0 OID 962035)
-- Dependencies: 224
-- Data for Name: phone_verified_codes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5209 (class 0 OID 962322)
-- Dependencies: 258
-- Data for Name: recipient_payments; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5227 (class 0 OID 962483)
-- Dependencies: 276
-- Data for Name: renter_comments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.renter_comments VALUES (1, 'cool', 'cool', 2, 5, 5, 5, 5, 3, 3, 5, 5, false, true, '', '2025-08-18 18:33:15.316524+02', '2025-08-18 18:33:15.316524+02', 3);
INSERT INTO public.renter_comments VALUES (2, 'amazing!', 'amazing!', 2, 4, 2, 1, 4, 5, 1, 2, 4, false, true, '', '2025-08-18 18:53:23.553244+02', '2025-08-18 18:53:23.553244+02', 6);


--
-- TOC entry 5195 (class 0 OID 962191)
-- Dependencies: 244
-- Data for Name: searched_words; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5179 (class 0 OID 962066)
-- Dependencies: 228
-- Data for Name: seeds_status; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.seeds_status VALUES (1, 'admin_insert.js', true, '2025-07-13 13:52:02.661738+02', '2025-07-13 13:52:02.661738+02');
INSERT INTO public.seeds_status VALUES (2, 'listing_category_insert.js', true, '2025-07-13 13:52:02.674735+02', '2025-07-13 13:52:02.674735+02');
INSERT INTO public.seeds_status VALUES (3, 'system_pay_commissions.js', true, '2025-07-13 13:52:02.678267+02', '2025-07-13 13:52:02.678267+02');
INSERT INTO public.seeds_status VALUES (4, 'system_user_log_active_insert.js', true, '2025-07-13 13:52:02.680422+02', '2025-07-13 13:52:02.680422+02');


--
-- TOC entry 5207 (class 0 OID 962296)
-- Dependencies: 256
-- Data for Name: sender_payments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sender_payments VALUES (18, 31, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"76844017XW718604M","paypalOrderId":"53T74136ST885135D"}', true, false, NULL, '2025-08-19 17:32:07.653686+02', false, '2025-08-19 17:32:07.653686+02', '2025-08-19 17:32:07.653686+02', 5, 14);
INSERT INTO public.sender_payments VALUES (1, 39.61, 'paymentProofs/a6827de58d8f238f5d47.png', 'bank-transfer', '{}', true, false, NULL, '2025-08-18 18:10:12.052011+02', false, '2025-08-18 18:08:25.579322+02', '2025-08-18 18:06:15.469936+02', 4, 2);
INSERT INTO public.sender_payments VALUES (3, 35, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"5ES19194D53877904","paypalOrderId":"02W106901W972693K"}', true, false, NULL, '2025-08-18 18:29:43.55745+02', false, '2025-08-18 18:29:43.55745+02', '2025-08-18 18:29:43.55745+02', 4, 3);
INSERT INTO public.sender_payments VALUES (4, 15, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"3UP47232E34241528","paypalOrderId":"4VB090236M2141438"}', true, false, NULL, '2025-08-18 18:36:56.282275+02', false, '2025-08-18 18:36:56.282275+02', '2025-08-18 18:36:56.282275+02', 4, 4);
INSERT INTO public.sender_payments VALUES (5, 15.4, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"63696312L1131064U","paypalOrderId":"2DR01428CR8764608"}', true, false, NULL, '2025-08-18 18:39:46.840591+02', false, '2025-08-18 18:39:46.840591+02', '2025-08-18 18:39:46.840591+02', 4, 5);
INSERT INTO public.sender_payments VALUES (6, 10, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"74U14626MR870111G","paypalOrderId":"6YS61010MP153791W"}', true, false, NULL, '2025-08-18 18:48:47.956543+02', false, '2025-08-18 18:48:47.956543+02', '2025-08-18 18:48:47.956543+02', 4, 6);
INSERT INTO public.sender_payments VALUES (19, 25.8, 'paymentProofs/6b4c27b127a061a656b5.png', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 17:41:08.464676+02', false, '2025-08-19 17:38:27.192313+02', '2025-08-19 17:38:27.192313+02', 5, 15);
INSERT INTO public.sender_payments VALUES (7, 41.81, 'paymentProofs/8e226e1782c87327750c.png', 'bank-transfer', '{}', true, false, NULL, '2025-08-18 18:56:09.571842+02', false, '2025-08-18 18:56:01.351844+02', '2025-08-18 18:55:30.132545+02', 4, 7);
INSERT INTO public.sender_payments VALUES (8, 49.27, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"4M013693KF250741Y","paypalOrderId":"6C400906XF279864D"}', true, false, NULL, '2025-08-18 19:07:37.478569+02', false, '2025-08-18 19:07:37.478569+02', '2025-08-18 19:07:37.478569+02', 4, 8);
INSERT INTO public.sender_payments VALUES (9, 11.12, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"2VC74679Y0587222K","paypalOrderId":"2RS225671R369450J"}', true, false, NULL, '2025-08-18 19:09:42.499907+02', false, '2025-08-18 19:09:42.499907+02', '2025-08-18 19:09:42.499907+02', 4, 9);
INSERT INTO public.sender_payments VALUES (10, 77.74, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"2U754000MM204500F","paypalOrderId":"7JU345614R964682K"}', true, false, NULL, '2025-08-18 19:12:13.432782+02', false, '2025-08-18 19:12:13.432782+02', '2025-08-18 19:12:13.432782+02', 4, 10);
INSERT INTO public.sender_payments VALUES (11, 14.76, 'paymentProofs/551e17387ab0ad88be79.jpeg', 'bank-transfer', '{}', true, false, NULL, '2025-08-18 19:14:15.055266+02', false, '2025-08-18 19:14:03.986121+02', '2025-08-18 19:14:03.986121+02', 4, 11);
INSERT INTO public.sender_payments VALUES (20, 14.76, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"6SW51482KF471973V","paypalOrderId":"9LV69011X4312600N"}', true, false, NULL, '2025-08-19 17:46:18.296258+02', false, '2025-08-19 17:46:18.296258+02', '2025-08-19 17:46:18.296258+02', 8, 16);
INSERT INTO public.sender_payments VALUES (21, 50.03, 'paymentProofs/40d08b9a727977f8ecd6.png', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 17:51:36.726311+02', false, '2025-08-19 17:50:01.55289+02', '2025-08-19 17:50:01.55289+02', 8, 17);
INSERT INTO public.sender_payments VALUES (22, 98.67, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"78914488UU686845Y","paypalOrderId":"6J4675835J9929308"}', true, false, NULL, '2025-08-19 17:53:00.13102+02', false, '2025-08-19 17:53:00.13102+02', '2025-08-19 17:53:00.13102+02', 5, 18);
INSERT INTO public.sender_payments VALUES (12, 10.2, 'paymentProofs/e5cfb7976b7e2b985eda.jpeg', 'bank-transfer', '{}', true, false, NULL, '2025-08-18 19:17:17.797696+02', false, '2025-08-18 19:17:09.553739+02', '2025-08-18 19:16:12.170425+02', 4, 12);
INSERT INTO public.sender_payments VALUES (13, 10.2, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"50Y9970504952351C","paypalOrderId":"8DB5089811559160N"}', true, false, NULL, '2025-08-18 19:26:53.86554+02', false, '2025-08-18 19:26:53.86554+02', '2025-08-18 19:26:53.86554+02', 4, 13);
INSERT INTO public.sender_payments VALUES (23, 33.8, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"48U38973D14789246","paypalOrderId":"1TU466284U550592J"}', true, false, NULL, '2025-08-19 18:01:19.935343+02', false, '2025-08-19 18:01:19.935343+02', '2025-08-19 18:01:19.935343+02', 9, 19);
INSERT INTO public.sender_payments VALUES (24, 26.6, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"4P374787YN8523345","paypalOrderId":"9C007684NA425791E"}', true, false, NULL, '2025-08-19 18:02:44.534748+02', false, '2025-08-19 18:02:44.534748+02', '2025-08-19 18:02:44.534748+02', 11, 20);
INSERT INTO public.sender_payments VALUES (25, 40.53, 'paymentProofs/cf6ddc8295f4720632b8.jpeg', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 18:05:04.959564+02', false, '2025-08-19 18:04:47.131173+02', '2025-08-19 18:04:47.131173+02', 9, 21);
INSERT INTO public.sender_payments VALUES (26, 35.4, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"65369276YY083984B","paypalOrderId":"0TT73840517522318"}', true, false, NULL, '2025-08-19 18:06:09.992265+02', false, '2025-08-19 18:06:09.992265+02', '2025-08-19 18:06:09.992265+02', 11, 22);
INSERT INTO public.sender_payments VALUES (27, 25, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"74D41110LT101503G","paypalOrderId":"13E100201M7934503"}', true, false, NULL, '2025-08-19 18:11:16.511532+02', false, '2025-08-19 18:11:16.511532+02', '2025-08-19 18:11:16.511532+02', 9, 23);
INSERT INTO public.sender_payments VALUES (28, 25, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"6AU21003R27787310","paypalOrderId":"1WM94182TM300101T"}', true, false, NULL, '2025-08-19 18:15:56.751725+02', false, '2025-08-19 18:15:56.751725+02', '2025-08-19 18:15:56.751725+02', 11, 24);
INSERT INTO public.sender_payments VALUES (29, 30, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"3HT09292221990528","paypalOrderId":"5T29398362222442L"}', true, false, NULL, '2025-08-19 18:16:13.234267+02', false, '2025-08-19 18:16:13.234267+02', '2025-08-19 18:16:13.234267+02', 9, 25);
INSERT INTO public.sender_payments VALUES (30, 22.6, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"1A7867418V911341K","paypalOrderId":"7WV43921K7079800U"}', true, false, NULL, '2025-08-19 18:27:15.249875+02', false, '2025-08-19 18:27:15.249875+02', '2025-08-19 18:27:15.249875+02', 13, 26);
INSERT INTO public.sender_payments VALUES (31, 195.56, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"16542346RJ611273N","paypalOrderId":"94B132720L781233H"}', true, false, NULL, '2025-08-19 18:30:29.99375+02', false, '2025-08-19 18:30:29.99375+02', '2025-08-19 18:30:29.99375+02', 14, 27);
INSERT INTO public.sender_payments VALUES (32, 25, 'paymentProofs/c17a576500f04417580d.jpeg', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 18:31:37.151913+02', false, '2025-08-19 18:31:19.137522+02', '2025-08-19 18:31:19.137522+02', 13, 28);
INSERT INTO public.sender_payments VALUES (33, 52.47, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"0BS92466DS585435R","paypalOrderId":"8MW354594A9592742"}', true, false, NULL, '2025-08-19 18:32:29.866052+02', false, '2025-08-19 18:32:29.866052+02', '2025-08-19 18:32:29.866052+02', 13, 29);
INSERT INTO public.sender_payments VALUES (34, 25.28, 'paymentProofs/ae1754bc3034f5e510e0.png', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 18:34:10.729501+02', false, '2025-08-19 18:34:05.804801+02', '2025-08-19 18:34:05.804801+02', 14, 30);
INSERT INTO public.sender_payments VALUES (35, 10.07, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"5YR17411Y21994949","paypalOrderId":"72481071139069343"}', true, false, NULL, '2025-08-19 18:35:27.377679+02', false, '2025-08-19 18:35:27.377679+02', '2025-08-19 18:35:27.377679+02', 13, 31);
INSERT INTO public.sender_payments VALUES (36, 30, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"7U074841H6241464E","paypalOrderId":"4RF56065HP732681L"}', true, false, NULL, '2025-08-19 18:41:11.585766+02', false, '2025-08-19 18:41:11.585766+02', '2025-08-19 18:41:11.585766+02', 14, 32);
INSERT INTO public.sender_payments VALUES (37, 25, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"1GW67994SH1383722","paypalOrderId":"9PJ91137TV1345351"}', true, false, NULL, '2025-08-19 18:41:23.050235+02', false, '2025-08-19 18:41:23.050235+02', '2025-08-19 18:41:23.050235+02', 13, 33);
INSERT INTO public.sender_payments VALUES (39, 20, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"4UV593937P413910V","paypalOrderId":"7L0640836B088704W"}', true, false, NULL, '2025-08-19 18:43:23.641477+02', false, '2025-08-19 18:43:23.641477+02', '2025-08-19 18:43:23.641477+02', 13, 35);
INSERT INTO public.sender_payments VALUES (38, 25, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"7UU020177L409605F","paypalOrderId":"9BJ50211BP481823T"}', true, false, NULL, '2025-08-19 18:43:19.303222+02', false, '2025-08-19 18:43:19.303222+02', '2025-08-19 18:43:19.303222+02', 14, 34);
INSERT INTO public.sender_payments VALUES (40, 20, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"7S373046Y8236922M","paypalOrderId":"2UM59487CE984250P"}', true, false, NULL, '2025-08-19 18:44:38.237927+02', false, '2025-08-19 18:44:38.237927+02', '2025-08-19 18:44:38.237927+02', 13, 37);
INSERT INTO public.sender_payments VALUES (41, 15, 'paymentProofs/23f763747fe6da570fab.png', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 18:45:04.856938+02', false, '2025-08-19 18:44:57.57015+02', '2025-08-19 18:44:57.57015+02', 14, 36);
INSERT INTO public.sender_payments VALUES (42, 31.4, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"3RF28769ME803193T","paypalOrderId":"5103022994010174E"}', true, false, NULL, '2025-08-19 19:06:48.651559+02', false, '2025-08-19 19:06:48.651559+02', '2025-08-19 19:06:48.651559+02', 13, 38);
INSERT INTO public.sender_payments VALUES (43, 20, 'paymentProofs/4f86ea0e86abe4ba0351.png', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 19:07:35.912446+02', false, '2025-08-19 19:06:57.330463+02', '2025-08-19 19:06:57.330463+02', 14, 39);
INSERT INTO public.sender_payments VALUES (44, 109.25, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"0M984887TA649794D","paypalOrderId":"3EH844089V438211F"}', true, false, NULL, '2025-08-19 19:10:39.666451+02', false, '2025-08-19 19:10:39.666451+02', '2025-08-19 19:10:39.666451+02', 14, 41);
INSERT INTO public.sender_payments VALUES (45, 46, 'paymentProofs/830cc635f8f20a8dde4d.png', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 19:11:28.41721+02', false, '2025-08-19 19:11:20.12524+02', '2025-08-19 19:11:05.520041+02', 13, 40);
INSERT INTO public.sender_payments VALUES (46, 12.2, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"2VV74997MP889535P","paypalOrderId":"13840481LA393954L"}', true, false, NULL, '2025-08-19 19:16:47.780209+02', false, '2025-08-19 19:16:47.780209+02', '2025-08-19 19:16:47.780209+02', 13, 42);
INSERT INTO public.sender_payments VALUES (47, 12.61, 'paymentProofs/e184b7585636146bcd0c.png', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 19:17:53.762998+02', false, '2025-08-19 19:17:46.49685+02', '2025-08-19 19:17:18.41331+02', 14, 43);
INSERT INTO public.sender_payments VALUES (48, 30, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"0VX86656YX900223G","paypalOrderId":"42U258098G3388944"}', true, false, NULL, '2025-08-19 19:19:43.432793+02', false, '2025-08-19 19:19:43.432793+02', '2025-08-19 19:19:43.432793+02', 14, 44);
INSERT INTO public.sender_payments VALUES (49, 12.6, 'paymentProofs/dc7eb34852d6ca9320e2.png', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 19:21:19.053284+02', false, '2025-08-19 19:21:11.229217+02', '2025-08-19 19:21:11.229217+02', 14, 45);
INSERT INTO public.sender_payments VALUES (50, 11.06, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"9YW026173K764980W","paypalOrderId":"4G701953FF399882A"}', true, false, NULL, '2025-08-19 19:31:26.947143+02', false, '2025-08-19 19:31:26.947143+02', '2025-08-19 19:31:26.947143+02', 13, 46);
INSERT INTO public.sender_payments VALUES (51, 11.06, 'paymentProofs/f645815d8f60c60fab18.png', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 19:32:10.245588+02', false, '2025-08-19 19:31:35.181892+02', '2025-08-19 19:31:35.181892+02', 14, 47);
INSERT INTO public.sender_payments VALUES (52, 11.06, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"3V684289HM490351L","paypalOrderId":"31R394556U5312847"}', true, false, NULL, '2025-08-19 19:33:17.534505+02', false, '2025-08-19 19:33:17.534505+02', '2025-08-19 19:33:17.534505+02', 14, 49);
INSERT INTO public.sender_payments VALUES (53, 11.06, 'paymentProofs/4fd1b9fd372c45f23f2f.jpeg', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 19:33:58.602688+02', false, '2025-08-19 19:33:31.013205+02', '2025-08-19 19:33:31.013205+02', 13, 48);
INSERT INTO public.sender_payments VALUES (54, 534.75, '', 'paypal', '{"paypalSenderId":"6WQ68DM2A9FGS","paypalCaptureId":"36U35338F5152872F","paypalOrderId":"3ND70638X95610410"}', true, false, NULL, '2025-08-19 19:39:19.898148+02', false, '2025-08-19 19:39:19.898148+02', '2025-08-19 19:39:19.898148+02', 13, 50);
INSERT INTO public.sender_payments VALUES (55, 529, 'paymentProofs/0120ec6bcb1300ae671e.png', 'bank-transfer', '{}', true, false, NULL, '2025-08-19 19:39:55.574547+02', false, '2025-08-19 19:39:48.049722+02', '2025-08-19 19:39:48.049722+02', 1, 51);


--
-- TOC entry 5223 (class 0 OID 962453)
-- Dependencies: 272
-- Data for Name: sockets; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sockets VALUES (126, 'doIFsvcaNTXqNPuFAAAl', '2025-07-15 21:07:36.307017+02', '2025-07-15 21:07:36.307017+02', 1);
INSERT INTO public.sockets VALUES (127, 'kHJy4Y6Ai719SujTAAAn', '2025-07-15 21:07:41.989216+02', '2025-07-15 21:07:41.989216+02', 1);
INSERT INTO public.sockets VALUES (128, 'iVddNpCJA7reChORAAAp', '2025-07-15 21:08:24.82557+02', '2025-07-15 21:08:24.82557+02', 1);
INSERT INTO public.sockets VALUES (129, '0IwTtNM3Em0ae0iiAAAr', '2025-07-15 21:08:26.384826+02', '2025-07-15 21:08:26.384826+02', 1);
INSERT INTO public.sockets VALUES (130, 'BUdXUMPMj1iIAPdQAAAt', '2025-07-15 21:10:47.489989+02', '2025-07-15 21:10:47.489989+02', 1);
INSERT INTO public.sockets VALUES (131, 'SeGNEqAkXChXvMGEAAAv', '2025-07-15 21:10:51.781137+02', '2025-07-15 21:10:51.781137+02', 1);
INSERT INTO public.sockets VALUES (132, 'R2jzphTDRJSItwhgAAAH', '2025-07-15 21:16:02.557336+02', '2025-07-15 21:16:02.557336+02', 1);
INSERT INTO public.sockets VALUES (133, 'C-RazK5tfwbmG0nNAAAI', '2025-07-15 21:16:02.557775+02', '2025-07-15 21:16:02.557775+02', 1);
INSERT INTO public.sockets VALUES (134, 'JBw7p15cuRaSBUoGAAAJ', '2025-07-15 21:16:02.558296+02', '2025-07-15 21:16:02.558296+02', 1);
INSERT INTO public.sockets VALUES (135, 'L-Tx_9LM15Zs1VEcAAAK', '2025-07-15 21:16:02.559017+02', '2025-07-15 21:16:02.559017+02', 1);
INSERT INTO public.sockets VALUES (136, 'G45bKCaHOjBu446bAAAL', '2025-07-15 21:16:02.559311+02', '2025-07-15 21:16:02.559311+02', 1);
INSERT INTO public.sockets VALUES (137, 'UpmQ28Jv4GLBUGgnAAAM', '2025-07-15 21:16:02.559531+02', '2025-07-15 21:16:02.559531+02', 1);
INSERT INTO public.sockets VALUES (138, 'Hhkx5TswAqY1lGFvAAAN', '2025-07-15 21:16:02.559821+02', '2025-07-15 21:16:02.559821+02', 1);
INSERT INTO public.sockets VALUES (139, 'Zd-DAcc6t2vJJUo3AAAH', '2025-07-15 21:16:06.549396+02', '2025-07-15 21:16:06.549396+02', 1);
INSERT INTO public.sockets VALUES (140, '68CZO1UkHoSaL78MAAAI', '2025-07-15 21:16:06.550573+02', '2025-07-15 21:16:06.550573+02', 1);
INSERT INTO public.sockets VALUES (141, 'M11Ziaxte_YHH08PAAAK', '2025-07-15 21:16:06.551141+02', '2025-07-15 21:16:06.551141+02', 1);
INSERT INTO public.sockets VALUES (142, '4Ey_B4DgdTYPgng4AAAJ', '2025-07-15 21:16:06.551663+02', '2025-07-15 21:16:06.551663+02', 1);
INSERT INTO public.sockets VALUES (143, 'bcr9-_drEX15D1cMAAAN', '2025-07-15 21:16:06.552001+02', '2025-07-15 21:16:06.552001+02', 1);
INSERT INTO public.sockets VALUES (145, 'XOMztH5Q_FOmoZ_lAAAM', '2025-07-15 21:16:06.55265+02', '2025-07-15 21:16:06.55265+02', 1);
INSERT INTO public.sockets VALUES (144, 'kpczQasW9YuNtoxsAAAL', '2025-07-15 21:16:06.552194+02', '2025-07-15 21:16:06.552194+02', 1);
INSERT INTO public.sockets VALUES (146, 'XQyu_xwJL2uD84pmAAAD', '2025-07-15 21:16:08.538979+02', '2025-07-15 21:16:08.538979+02', 1);
INSERT INTO public.sockets VALUES (147, '4B3qsKNmu8_JYQBPAAAE', '2025-07-15 21:16:08.539552+02', '2025-07-15 21:16:08.539552+02', 1);
INSERT INTO public.sockets VALUES (148, 'WmNTtovgPwNDjCMeAAAF', '2025-07-15 21:16:08.540061+02', '2025-07-15 21:16:08.540061+02', 1);
INSERT INTO public.sockets VALUES (225, '0u1AtwcWgIoAk4BoAAAB', '2025-07-15 21:48:53.531626+02', '2025-07-15 21:48:53.531626+02', 1);
INSERT INTO public.sockets VALUES (226, 'A0L7OO8BebO0xjPEAAAB', '2025-07-15 21:48:55.774073+02', '2025-07-15 21:48:55.774073+02', 1);
INSERT INTO public.sockets VALUES (228, 'V1ZHRJ3Zc6Kwo-ljAAAD', '2025-07-15 21:49:03.951356+02', '2025-07-15 21:49:03.951356+02', 1);
INSERT INTO public.sockets VALUES (418, 'g7RdGjCU4cdyPoLbAABX', '2025-07-19 15:51:12.280252+02', '2025-07-19 15:51:12.280252+02', 1);
INSERT INTO public.sockets VALUES (230, 'WnwOXmeSfFinvemvAAAD', '2025-07-15 21:49:33.695151+02', '2025-07-15 21:49:33.695151+02', 1);
INSERT INTO public.sockets VALUES (231, 'v7u5c8nncdu1uuDOAAAB', '2025-07-15 21:51:34.790974+02', '2025-07-15 21:51:34.790974+02', 1);
INSERT INTO public.sockets VALUES (158, 'zazqXQIGlR4RxHpNAAAT', '2025-07-15 21:20:48.364481+02', '2025-07-15 21:20:48.364481+02', 1);
INSERT INTO public.sockets VALUES (106, 'fmD6EfG5Oq7FB9y_AAAB', '2025-07-15 20:47:04.798086+02', '2025-07-15 20:47:04.798086+02', 1);
INSERT INTO public.sockets VALUES (107, 'Cmn1zA5Armhd4kkmAAAB', '2025-07-15 20:49:52.525775+02', '2025-07-15 20:49:52.525775+02', 1);
INSERT INTO public.sockets VALUES (159, 'g9iWjyAie6Le5UqeAAAB', '2025-07-15 21:21:16.357892+02', '2025-07-15 21:21:16.357892+02', 1);
INSERT INTO public.sockets VALUES (160, '1HqnB6mhAptw4FLBAAAB', '2025-07-15 21:21:36.527663+02', '2025-07-15 21:21:36.527663+02', 1);
INSERT INTO public.sockets VALUES (161, '0wwqk1nQOfbGnsGJAAAB', '2025-07-15 21:22:01.532744+02', '2025-07-15 21:22:01.532744+02', 1);
INSERT INTO public.sockets VALUES (968, 'ttGAyLeszIg5TOmBAABD', '2025-08-17 14:51:02.824477+02', '2025-08-17 14:51:02.824477+02', 1);
INSERT INTO public.sockets VALUES (969, 'op2h6NTPI3cnObdbAAAB', '2025-08-17 20:51:21.384376+02', '2025-08-17 20:51:21.384376+02', 1);
INSERT INTO public.sockets VALUES (172, 'azE69oclOZYYGfynAAAV', '2025-07-15 21:28:25.167552+02', '2025-07-15 21:28:25.167552+02', 1);
INSERT INTO public.sockets VALUES (173, 'Tl13PVikDSMX2PnMAAAB', '2025-07-15 21:29:02.530992+02', '2025-07-15 21:29:02.530992+02', 1);
INSERT INTO public.sockets VALUES (174, 'go3s_IgnY3nliH6eAAAB', '2025-07-15 21:29:05.410537+02', '2025-07-15 21:29:05.410537+02', 1);
INSERT INTO public.sockets VALUES (175, 'vAkmnzMgAkR-xkO2AAAB', '2025-07-15 21:29:13.524496+02', '2025-07-15 21:29:13.524496+02', 1);
INSERT INTO public.sockets VALUES (125, 'I1ZT9ttpbs70WptTAAAj', '2025-07-15 21:00:07.274418+02', '2025-07-15 21:00:07.274418+02', 1);
INSERT INTO public.sockets VALUES (435, 'KjXzSFiIRCsRTxS4AAAf', '2025-07-22 20:47:35.009818+02', '2025-07-22 20:47:35.009818+02', 1);
INSERT INTO public.sockets VALUES (181, 'v7w8ibSAdWlSJvuhAAAL', '2025-07-15 21:35:26.346302+02', '2025-07-15 21:35:26.346302+02', 1);
INSERT INTO public.sockets VALUES (182, 'V46fgCMMbTcPI5HyAAAN', '2025-07-15 21:40:23.166564+02', '2025-07-15 21:40:23.166564+02', 1);
INSERT INTO public.sockets VALUES (183, '4dcJbOQZQGbWSFPsAAAP', '2025-07-15 21:40:24.602635+02', '2025-07-15 21:40:24.602635+02', 1);
INSERT INTO public.sockets VALUES (184, '-3tXoJXen3ChBpG0AAAB', '2025-07-15 21:40:40.555329+02', '2025-07-15 21:40:40.555329+02', 1);
INSERT INTO public.sockets VALUES (185, 'Kl7yNKZ77-GftrNfAAAE', '2025-07-15 21:40:41.48423+02', '2025-07-15 21:40:41.48423+02', 1);
INSERT INTO public.sockets VALUES (186, 'mddJYQPAxWMMUo1-AAAF', '2025-07-15 21:40:41.485221+02', '2025-07-15 21:40:41.485221+02', 1);
INSERT INTO public.sockets VALUES (187, 'SVfU6sxwr-5lACqPAAAC', '2025-07-15 21:40:43.533291+02', '2025-07-15 21:40:43.533291+02', 1);
INSERT INTO public.sockets VALUES (188, '2XxrDYFBx1olLxcaAAAD', '2025-07-15 21:40:43.533879+02', '2025-07-15 21:40:43.533879+02', 1);
INSERT INTO public.sockets VALUES (189, 'JcTGwMHHT4xhOJltAAAF', '2025-07-15 21:40:44.487775+02', '2025-07-15 21:40:44.487775+02', 1);
INSERT INTO public.sockets VALUES (443, 'O7XGEO3oE4e804WmAAAD', '2025-07-24 19:01:26.943647+02', '2025-07-24 19:01:26.943647+02', 1);
INSERT INTO public.sockets VALUES (444, '1KMrqK03KjBRuFM8AAAF', '2025-07-24 19:06:54.290709+02', '2025-07-24 19:06:54.290709+02', 1);
INSERT INTO public.sockets VALUES (445, 'kVQuY-wnYbM9gp-ZAAAH', '2025-07-24 19:10:08.07609+02', '2025-07-24 19:10:08.07609+02', 1);
INSERT INTO public.sockets VALUES (446, 'q_C7C5BcniqBZZXkAAAJ', '2025-07-24 19:10:11.570732+02', '2025-07-24 19:10:11.570732+02', 1);
INSERT INTO public.sockets VALUES (447, 'Ivjy6tJjtJQyzkCtAAAL', '2025-07-24 19:10:13.46179+02', '2025-07-24 19:10:13.46179+02', 1);
INSERT INTO public.sockets VALUES (448, '3p8sGwEDtkecFA-BAAAN', '2025-07-24 19:10:16.410722+02', '2025-07-24 19:10:16.410722+02', 1);
INSERT INTO public.sockets VALUES (449, 'QeMlteyEM2RGiDJtAAAP', '2025-07-24 19:10:33.035662+02', '2025-07-24 19:10:33.035662+02', 1);
INSERT INTO public.sockets VALUES (450, 'XP4KllIf3JFIIZL0AAAF', '2025-07-24 19:11:01.715673+02', '2025-07-24 19:11:01.715673+02', 1);
INSERT INTO public.sockets VALUES (451, 'lQEXt28Dvd4bUCy7AAAH', '2025-07-24 19:11:01.71637+02', '2025-07-24 19:11:01.71637+02', 1);
INSERT INTO public.sockets VALUES (452, 'D33m17DlqoeAYc2uAAAG', '2025-07-24 19:11:01.716002+02', '2025-07-24 19:11:01.716002+02', 1);
INSERT INTO public.sockets VALUES (453, 'wY0JD6zHB1qmOiUQAAAI', '2025-07-24 19:11:01.717057+02', '2025-07-24 19:11:01.717057+02', 1);
INSERT INTO public.sockets VALUES (454, '0rw1Fp2a4Y7nmOxfAAAJ', '2025-07-24 19:11:01.717532+02', '2025-07-24 19:11:01.717532+02', 1);
INSERT INTO public.sockets VALUES (455, 'FZlFhGTbsu8P6JXJAAAC', '2025-07-24 19:11:03.205319+02', '2025-07-24 19:11:03.205319+02', 1);
INSERT INTO public.sockets VALUES (456, 'qH7t8aSkkRHYWHXMAAAD', '2025-07-24 19:11:03.205691+02', '2025-07-24 19:11:03.205691+02', 1);
INSERT INTO public.sockets VALUES (457, 'hwlqUH0Froexkj5lAAAJ', '2025-07-24 19:11:03.673101+02', '2025-07-24 19:11:03.673101+02', 1);
INSERT INTO public.sockets VALUES (458, 'QqQF7u72b0waj2v4AAAK', '2025-07-24 19:11:03.675425+02', '2025-07-24 19:11:03.675425+02', 1);
INSERT INTO public.sockets VALUES (459, '-jonsf0c6giLybFNAAAL', '2025-07-24 19:11:03.677258+02', '2025-07-24 19:11:03.677258+02', 1);
INSERT INTO public.sockets VALUES (460, '_hsjyssr7zzqQU2RAAAM', '2025-07-24 19:11:03.677851+02', '2025-07-24 19:11:03.677851+02', 1);
INSERT INTO public.sockets VALUES (461, '0JyHJbVWk06Hx-k2AAAN', '2025-07-24 19:11:03.678284+02', '2025-07-24 19:11:03.678284+02', 1);
INSERT INTO public.sockets VALUES (462, 'EiEItssWIHcf6aZtAAAH', '2025-07-24 19:11:08.715629+02', '2025-07-24 19:11:08.715629+02', 1);
INSERT INTO public.sockets VALUES (463, '8iiG2WOeBFpTLWt-AAAJ', '2025-07-24 19:11:08.716356+02', '2025-07-24 19:11:08.716356+02', 1);
INSERT INTO public.sockets VALUES (465, 'vY_xJYhWJxBZqGCbAAAL', '2025-07-24 19:11:08.717197+02', '2025-07-24 19:11:08.717197+02', 1);
INSERT INTO public.sockets VALUES (464, '1MFR-zmt0uiC7tFlAAAI', '2025-07-24 19:11:08.716827+02', '2025-07-24 19:11:08.716827+02', 1);
INSERT INTO public.sockets VALUES (373, 'L-1U1bAEgbrGnZaTAADV', '2025-07-18 20:59:51.995417+02', '2025-07-18 20:59:51.995417+02', 1);
INSERT INTO public.sockets VALUES (374, 'GJRQKzLnDknHx_qsAAAB', '2025-07-18 21:00:13.281634+02', '2025-07-18 21:00:13.281634+02', 1);
INSERT INTO public.sockets VALUES (466, 'WhUZBayHpMK3K_CgAAAM', '2025-07-24 19:11:08.717496+02', '2025-07-24 19:11:08.717496+02', 1);
INSERT INTO public.sockets VALUES (467, 'gpu5muKM47F1_SOGAAAK', '2025-07-24 19:11:08.717668+02', '2025-07-24 19:11:08.717668+02', 1);
INSERT INTO public.sockets VALUES (224, 'iZpCT-FvoaWxTRKFAABF', '2025-07-15 21:47:09.434722+02', '2025-07-15 21:47:09.434722+02', 1);
INSERT INTO public.sockets VALUES (468, 'TszOM1u6MaUoIZB2AAAN', '2025-07-24 19:11:08.717822+02', '2025-07-24 19:11:08.717822+02', 1);
INSERT INTO public.sockets VALUES (469, 'oJ4xABvK4DEkSa7XAAAG', '2025-07-24 19:11:18.732003+02', '2025-07-24 19:11:18.732003+02', 1);
INSERT INTO public.sockets VALUES (470, 'WZtc-eLUOtP_zIBJAAAH', '2025-07-24 19:11:18.732537+02', '2025-07-24 19:11:18.732537+02', 1);
INSERT INTO public.sockets VALUES (471, 'cSj1AtC_n52WsDdnAAAI', '2025-07-24 19:11:18.733063+02', '2025-07-24 19:11:18.733063+02', 1);
INSERT INTO public.sockets VALUES (472, '6_9xZJZSfffApU9-AAAK', '2025-07-24 19:11:18.733628+02', '2025-07-24 19:11:18.733628+02', 1);
INSERT INTO public.sockets VALUES (473, 'v3Rf_gIGV4gB3jaqAAAJ', '2025-07-24 19:11:18.734074+02', '2025-07-24 19:11:18.734074+02', 1);
INSERT INTO public.sockets VALUES (474, 'hW1jSpu-SbcYGpHLAAAL', '2025-07-24 19:11:18.735309+02', '2025-07-24 19:11:18.735309+02', 1);
INSERT INTO public.sockets VALUES (475, '4LntQemUJZ7Xk5aoAAAN', '2025-07-24 19:11:21.661368+02', '2025-07-24 19:11:21.661368+02', 1);
INSERT INTO public.sockets VALUES (476, 'fV1z6ShRIw45DCsqAAAH', '2025-07-24 19:11:32.730545+02', '2025-07-24 19:11:32.730545+02', 1);
INSERT INTO public.sockets VALUES (477, 'arLlup2u8KFrg4cVAAAI', '2025-07-24 19:11:32.731147+02', '2025-07-24 19:11:32.731147+02', 1);
INSERT INTO public.sockets VALUES (478, 'gKw8nSS1TJkZBonXAAAJ', '2025-07-24 19:11:32.73183+02', '2025-07-24 19:11:32.73183+02', 1);
INSERT INTO public.sockets VALUES (479, 'ZgOtY5mL8cM_9NVqAAAL', '2025-07-24 19:11:32.732258+02', '2025-07-24 19:11:32.732258+02', 1);
INSERT INTO public.sockets VALUES (480, 'yAhF6P-CkfhX0yKlAAAK', '2025-07-24 19:11:32.732788+02', '2025-07-24 19:11:32.732788+02', 1);
INSERT INTO public.sockets VALUES (481, 'S_d_Hn8KG-C3jRJaAAAM', '2025-07-24 19:11:32.733182+02', '2025-07-24 19:11:32.733182+02', 1);
INSERT INTO public.sockets VALUES (482, 'QKiCZWJiFaA4FV33AAAN', '2025-07-24 19:11:32.733466+02', '2025-07-24 19:11:32.733466+02', 1);
INSERT INTO public.sockets VALUES (483, 'v6jwHlIqJNx7cD7iAAAC', '2025-07-24 19:11:38.971077+02', '2025-07-24 19:11:38.971077+02', 1);
INSERT INTO public.sockets VALUES (484, 'TVFTVuJjYAN9bISVAAAD', '2025-07-24 19:11:38.971916+02', '2025-07-24 19:11:38.971916+02', 1);
INSERT INTO public.sockets VALUES (485, 'Uv8VkBahQkioAnacAAAE', '2025-07-24 19:11:40.711824+02', '2025-07-24 19:11:40.711824+02', 1);
INSERT INTO public.sockets VALUES (486, 'Fna8McEBF7h-mtT4AAAF', '2025-07-24 19:11:40.712222+02', '2025-07-24 19:11:40.712222+02', 1);
INSERT INTO public.sockets VALUES (487, 'F-d90IfoYRUkAjupAAAG', '2025-07-24 19:11:40.712643+02', '2025-07-24 19:11:40.712643+02', 1);
INSERT INTO public.sockets VALUES (488, '_MleE3ivqQghZK22AAAH', '2025-07-24 19:11:40.712934+02', '2025-07-24 19:11:40.712934+02', 1);
INSERT INTO public.sockets VALUES (489, 'rCsLw_jkUMCuII5EAAAH', '2025-07-24 19:11:44.025325+02', '2025-07-24 19:11:44.025325+02', 1);
INSERT INTO public.sockets VALUES (490, 'fngU9_S5FRUFnP3qAAAJ', '2025-07-24 19:11:44.025786+02', '2025-07-24 19:11:44.025786+02', 1);
INSERT INTO public.sockets VALUES (491, 'aXRVikWW_2cmd1qwAAAI', '2025-07-24 19:11:44.026706+02', '2025-07-24 19:11:44.026706+02', 1);
INSERT INTO public.sockets VALUES (492, 'JD3uxLyS8z6bREzgAAAK', '2025-07-24 19:11:44.027235+02', '2025-07-24 19:11:44.027235+02', 1);
INSERT INTO public.sockets VALUES (493, 'Yaf6TxBtjGcGKDHYAAAL', '2025-07-24 19:11:44.02762+02', '2025-07-24 19:11:44.02762+02', 1);
INSERT INTO public.sockets VALUES (494, 'l9ZcFDipW4W73cr9AAAM', '2025-07-24 19:11:44.027914+02', '2025-07-24 19:11:44.027914+02', 1);
INSERT INTO public.sockets VALUES (495, 'GMIZIb0arBpeGDOiAAAN', '2025-07-24 19:11:44.030972+02', '2025-07-24 19:11:44.030972+02', 1);
INSERT INTO public.sockets VALUES (496, 'v0QxPCyruu2QDyjSAAAG', '2025-07-24 19:11:48.699601+02', '2025-07-24 19:11:48.699601+02', 1);
INSERT INTO public.sockets VALUES (497, '91Bu7dQI-6qSD6xQAAAH', '2025-07-24 19:11:48.69994+02', '2025-07-24 19:11:48.69994+02', 1);
INSERT INTO public.sockets VALUES (498, '7QBb9tHx4DHFsHLxAAAI', '2025-07-24 19:11:48.700383+02', '2025-07-24 19:11:48.700383+02', 1);
INSERT INTO public.sockets VALUES (499, 'P5mlNW31-8tGAJFoAAAK', '2025-07-24 19:11:48.701148+02', '2025-07-24 19:11:48.701148+02', 1);
INSERT INTO public.sockets VALUES (500, 'AIqYsgt7oGFGIC5VAAAL', '2025-07-24 19:11:48.701831+02', '2025-07-24 19:11:48.701831+02', 1);
INSERT INTO public.sockets VALUES (501, 'IOCSAeLNq3QwijalAAAJ', '2025-07-24 19:11:48.702061+02', '2025-07-24 19:11:48.702061+02', 1);
INSERT INTO public.sockets VALUES (502, 'Y6R5Vi0uyIKQYigFAAAN', '2025-07-24 19:11:49.65095+02', '2025-07-24 19:11:49.65095+02', 1);
INSERT INTO public.sockets VALUES (503, 'miiJ5eoGb2fDs5dOAAAG', '2025-07-24 19:11:53.702903+02', '2025-07-24 19:11:53.702903+02', 1);
INSERT INTO public.sockets VALUES (504, 'TgCPRxFZDLWow3JfAAAH', '2025-07-24 19:11:53.703299+02', '2025-07-24 19:11:53.703299+02', 1);
INSERT INTO public.sockets VALUES (505, 'P1vZVjev8soUX7M9AAAI', '2025-07-24 19:11:53.70409+02', '2025-07-24 19:11:53.70409+02', 1);
INSERT INTO public.sockets VALUES (506, 'jYaKIJiM1vfr5VpQAAAJ', '2025-07-24 19:11:53.704618+02', '2025-07-24 19:11:53.704618+02', 1);
INSERT INTO public.sockets VALUES (507, 'k5p7j6Flc_v_bqBdAAAL', '2025-07-24 19:11:53.705026+02', '2025-07-24 19:11:53.705026+02', 1);
INSERT INTO public.sockets VALUES (508, 'L5B1DKF6RE-6TXLwAAAK', '2025-07-24 19:11:53.705296+02', '2025-07-24 19:11:53.705296+02', 1);
INSERT INTO public.sockets VALUES (509, '0_J3n7jrA-eLG-UJAAAN', '2025-07-24 19:11:54.650796+02', '2025-07-24 19:11:54.650796+02', 1);
INSERT INTO public.sockets VALUES (510, 'Y6Z6wqeSpNRQYQbVAAAG', '2025-07-24 19:11:56.729185+02', '2025-07-24 19:11:56.729185+02', 1);
INSERT INTO public.sockets VALUES (511, 'hpKu-SCMbAJC9m1FAAAH', '2025-07-24 19:11:56.729846+02', '2025-07-24 19:11:56.729846+02', 1);
INSERT INTO public.sockets VALUES (512, 'J1ZuF_kh_Yy4v4XwAAAI', '2025-07-24 19:11:56.733422+02', '2025-07-24 19:11:56.733422+02', 1);
INSERT INTO public.sockets VALUES (513, 'bybNGK7N8AEK0VXhAAAL', '2025-07-24 19:11:56.735013+02', '2025-07-24 19:11:56.735013+02', 1);
INSERT INTO public.sockets VALUES (514, 'OuWLu6SaWyVCtSPhAAAJ', '2025-07-24 19:11:56.735864+02', '2025-07-24 19:11:56.735864+02', 1);
INSERT INTO public.sockets VALUES (515, 'cPZRaB6qyWEytPvtAAAK', '2025-07-24 19:11:56.736316+02', '2025-07-24 19:11:56.736316+02', 1);
INSERT INTO public.sockets VALUES (516, '7LK3Ufj_qHmje9WPAAAB', '2025-07-24 19:11:58.443581+02', '2025-07-24 19:11:58.443581+02', 1);
INSERT INTO public.sockets VALUES (517, 'Z3QX9xVRsCkd0Fv3AAAI', '2025-07-24 19:11:58.652503+02', '2025-07-24 19:11:58.652503+02', 1);
INSERT INTO public.sockets VALUES (518, 'Nf1FHHyjMrE3pnuhAAAJ', '2025-07-24 19:11:58.660036+02', '2025-07-24 19:11:58.660036+02', 1);
INSERT INTO public.sockets VALUES (519, 'ECuO-cERBCn-M3kpAAAK', '2025-07-24 19:11:58.662756+02', '2025-07-24 19:11:58.662756+02', 1);
INSERT INTO public.sockets VALUES (520, 'FEVim4HNysXy0sYNAAAL', '2025-07-24 19:11:58.663365+02', '2025-07-24 19:11:58.663365+02', 1);
INSERT INTO public.sockets VALUES (521, 'Zoy8nBpJO2s5mgIhAAAM', '2025-07-24 19:11:58.664818+02', '2025-07-24 19:11:58.664818+02', 1);
INSERT INTO public.sockets VALUES (522, 'v7Fg1Ziqi8lGBjskAAAN', '2025-07-24 19:11:58.665442+02', '2025-07-24 19:11:58.665442+02', 1);
INSERT INTO public.sockets VALUES (523, 'FPVAA6rRY52himjvAAAB', '2025-07-24 19:12:05.955745+02', '2025-07-24 19:12:05.955745+02', 1);
INSERT INTO public.sockets VALUES (524, 'G2uY0DBN0jDN70tlAAAG', '2025-07-24 19:12:07.52117+02', '2025-07-24 19:12:07.52117+02', 1);
INSERT INTO public.sockets VALUES (525, 'Zfhh5xuhyGzC7AmxAAAI', '2025-07-24 19:12:07.521864+02', '2025-07-24 19:12:07.521864+02', 1);
INSERT INTO public.sockets VALUES (526, '49XkhxzJ8u8QHNtNAAAH', '2025-07-24 19:12:07.522672+02', '2025-07-24 19:12:07.522672+02', 1);
INSERT INTO public.sockets VALUES (527, 'lgqzqMnuUJzxndU0AAAJ', '2025-07-24 19:12:07.523036+02', '2025-07-24 19:12:07.523036+02', 1);
INSERT INTO public.sockets VALUES (528, 'MIHXrpTE_RZxhd7oAAAK', '2025-07-24 19:12:07.523411+02', '2025-07-24 19:12:07.523411+02', 1);
INSERT INTO public.sockets VALUES (529, 'VHuSNr8G7pbPQxCCAAAL', '2025-07-24 19:12:07.523612+02', '2025-07-24 19:12:07.523612+02', 1);
INSERT INTO public.sockets VALUES (530, '9qUWg_W_jjnzz6-aAAAN', '2025-07-24 19:12:07.638043+02', '2025-07-24 19:12:07.638043+02', 1);
INSERT INTO public.sockets VALUES (706, 'O3wY81DVcb1E_1lOAAA5', '2025-08-08 19:46:59.67824+02', '2025-08-08 19:46:59.67824+02', 1);
INSERT INTO public.sockets VALUES (708, '9TAejmnv-nIXPY34AAAB', '2025-08-08 19:48:10.996986+02', '2025-08-08 19:48:10.996986+02', 1);
INSERT INTO public.sockets VALUES (710, '_djg1JIR0u1QeaD1AAAB', '2025-08-08 19:48:17.098035+02', '2025-08-08 19:48:17.098035+02', 1);
INSERT INTO public.sockets VALUES (712, 't7r8nGzRzEuRJQeSAAAB', '2025-08-08 19:48:31.984628+02', '2025-08-08 19:48:31.984628+02', 1);
INSERT INTO public.sockets VALUES (714, 'kqASAlidtCboqCuHAAAB', '2025-08-08 19:48:49.130137+02', '2025-08-08 19:48:49.130137+02', 1);
INSERT INTO public.sockets VALUES (716, 'bdBKfznrY0_zusJpAAAB', '2025-08-08 19:48:56.011637+02', '2025-08-08 19:48:56.011637+02', 1);
INSERT INTO public.sockets VALUES (718, 'byS6MGa62_04J3evAAAB', '2025-08-08 19:49:33.006303+02', '2025-08-08 19:49:33.006303+02', 1);
INSERT INTO public.sockets VALUES (720, 'q8NcALgE-fOee4P8AAAB', '2025-08-08 19:50:00.992968+02', '2025-08-08 19:50:00.992968+02', 1);
INSERT INTO public.sockets VALUES (722, 'BYikGCla5xNwD6L3AAAB', '2025-08-08 19:50:24.567065+02', '2025-08-08 19:50:24.567065+02', 1);
INSERT INTO public.sockets VALUES (724, 'rcQXk2IfQlxLGN4eAAAB', '2025-08-08 19:50:28.983018+02', '2025-08-08 19:50:28.983018+02', 1);
INSERT INTO public.sockets VALUES (726, '7Oqinv9i3RYYewfGAAAB', '2025-08-08 19:50:38.992755+02', '2025-08-08 19:50:38.992755+02', 1);
INSERT INTO public.sockets VALUES (552, 'NRFmkDKdJz3HaXEsAAAd', '2025-08-08 18:03:29.657174+02', '2025-08-08 18:03:29.657174+02', 1);
INSERT INTO public.sockets VALUES (733, 'k5An3xXtWnaHek25AAAJ', '2025-08-08 19:52:19.727295+02', '2025-08-08 19:52:19.727295+02', 1);
INSERT INTO public.sockets VALUES (663, 'QBlMYMGXpikMGH6QAADb', '2025-08-08 18:55:14.65037+02', '2025-08-08 18:55:14.65037+02', 1);
INSERT INTO public.sockets VALUES (669, 'REffBl1CoobKnZnTAAAL', '2025-08-08 19:09:01.024443+02', '2025-08-08 19:09:01.024443+02', 1);
INSERT INTO public.sockets VALUES (674, 'LhfEkcbyC3BSXIyoAAAB', '2025-08-08 19:17:06.765911+02', '2025-08-08 19:17:06.765911+02', 1);
INSERT INTO public.sockets VALUES (676, 'ECJsQDZYLvB-W8nSAAAB', '2025-08-08 19:17:19.988539+02', '2025-08-08 19:17:19.988539+02', 1);
INSERT INTO public.sockets VALUES (763, 'x5RVnu4ipsZTLiwmAAAB', '2025-08-08 20:16:02.502806+02', '2025-08-08 20:16:02.502806+02', 1);
INSERT INTO public.sockets VALUES (765, 'Mrbm8cGmlDNwD8CCAAAB', '2025-08-08 20:16:14.99085+02', '2025-08-08 20:16:14.99085+02', 1);
INSERT INTO public.sockets VALUES (767, 'j7vk_HwetGUZi_2EAAAB', '2025-08-08 20:16:24.045685+02', '2025-08-08 20:16:24.045685+02', 1);
INSERT INTO public.sockets VALUES (769, 't98aRBwJrUS4XUjNAAAB', '2025-08-08 20:16:44.008198+02', '2025-08-08 20:16:44.008198+02', 1);
INSERT INTO public.sockets VALUES (771, 'FWz_RJOFi5dKz1P_AAAB', '2025-08-08 20:16:55.003799+02', '2025-08-08 20:16:55.003799+02', 1);
INSERT INTO public.sockets VALUES (773, '0ORlQAU0XuDoT-sPAAAB', '2025-08-08 20:17:11.002361+02', '2025-08-08 20:17:11.002361+02', 1);
INSERT INTO public.sockets VALUES (775, 'jsViA00TW9RJovPnAAAB', '2025-08-08 20:17:33.758647+02', '2025-08-08 20:17:33.758647+02', 1);
INSERT INTO public.sockets VALUES (777, 'V8BR6DfaAq_uzgY7AAAB', '2025-08-08 20:17:44.117126+02', '2025-08-08 20:17:44.117126+02', 1);
INSERT INTO public.sockets VALUES (780, 'YYjhYTewoS8xWI8KAAAD', '2025-08-08 20:19:00.452368+02', '2025-08-08 20:19:00.452368+02', 1);
INSERT INTO public.sockets VALUES (782, 'rHHuGRJfzzie-VTCAAAB', '2025-08-10 11:54:04.008475+02', '2025-08-10 11:54:04.008475+02', 1);
INSERT INTO public.sockets VALUES (784, 'XTNHhDCOhOv63WgAAAAB', '2025-08-10 11:54:55.29567+02', '2025-08-10 11:54:55.29567+02', 1);
INSERT INTO public.sockets VALUES (786, 'stFRAv7ukczy8_UEAAAB', '2025-08-10 11:55:03.006565+02', '2025-08-10 11:55:03.006565+02', 1);
INSERT INTO public.sockets VALUES (788, 'QCVgw88Us-lwsz5PAAAB', '2025-08-10 11:55:15.253298+02', '2025-08-10 11:55:15.253298+02', 1);
INSERT INTO public.sockets VALUES (790, 'jCl4MkvqVD8tIY1aAAAB', '2025-08-10 11:55:27.251071+02', '2025-08-10 11:55:27.251071+02', 1);
INSERT INTO public.sockets VALUES (799, 'aB00LRCS-NhagS0gAAAP', '2025-08-10 12:08:11.786972+02', '2025-08-10 12:08:11.786972+02', 2);
INSERT INTO public.sockets VALUES (815, '-16skj5L_UeNDxDpAAAC', '2025-08-10 12:43:19.035368+02', '2025-08-10 12:43:19.035368+02', 2);
INSERT INTO public.sockets VALUES (817, 'Jns2UQHwx70Zv5LrAAAB', '2025-08-10 12:43:22.209575+02', '2025-08-10 12:43:22.209575+02', 1);
INSERT INTO public.sockets VALUES (818, 'z_ef9tqG_WxmkPJAAAAD', '2025-08-10 12:43:22.9178+02', '2025-08-10 12:43:22.9178+02', 2);
INSERT INTO public.sockets VALUES (820, '4SfQViT8gUGt5E90AAAD', '2025-08-10 12:43:26.959601+02', '2025-08-10 12:43:26.959601+02', 1);
INSERT INTO public.sockets VALUES (822, '-Ue8gJsh8fyebf4ZAAAB', '2025-08-10 12:44:20.280753+02', '2025-08-10 12:44:20.280753+02', 2);
INSERT INTO public.sockets VALUES (823, 'puPzqNkI5fPVmPm_AAAD', '2025-08-10 12:44:20.917733+02', '2025-08-10 12:44:20.917733+02', 1);
INSERT INTO public.sockets VALUES (826, 'HVewvd0MUYjIFKH3AAAB', '2025-08-10 12:44:26.204216+02', '2025-08-10 12:44:26.204216+02', 2);
INSERT INTO public.sockets VALUES (827, 'lYS3iN1STVw9hcvIAAAD', '2025-08-10 12:44:26.812343+02', '2025-08-10 12:44:26.812343+02', 1);
INSERT INTO public.sockets VALUES (828, 'yBFx2ND8KEv_F5r-AAAF', '2025-08-10 12:47:07.144478+02', '2025-08-10 12:47:07.144478+02', 2);
INSERT INTO public.sockets VALUES (829, 'JOmlUQnvtf2WeDKVAAAH', '2025-08-10 12:47:07.169856+02', '2025-08-10 12:47:07.169856+02', 1);
INSERT INTO public.sockets VALUES (832, 'hYOt5v3rTIbPGy0RAAAF', '2025-08-10 12:47:33.241592+02', '2025-08-10 12:47:33.241592+02', 2);
INSERT INTO public.sockets VALUES (834, 'dM410IQBwX1La0JkAAAJ', '2025-08-10 12:47:33.243157+02', '2025-08-10 12:47:33.243157+02', 2);
INSERT INTO public.sockets VALUES (836, 'JR78Vf68IVBk8-jcAAAL', '2025-08-10 12:47:33.246651+02', '2025-08-10 12:47:33.246651+02', 1);
INSERT INTO public.sockets VALUES (838, 'qETr5LtXP7gyGFzIAAAE', '2025-08-10 12:47:34.987915+02', '2025-08-10 12:47:34.987915+02', 2);
INSERT INTO public.sockets VALUES (840, '_eMOc5-Gq4sqqrKQAAAH', '2025-08-10 12:47:34.988646+02', '2025-08-10 12:47:34.988646+02', 1);
INSERT INTO public.sockets VALUES (842, 'cHFHzuAU9V6NqLIKAAAC', '2025-08-10 12:47:36.715406+02', '2025-08-10 12:47:36.715406+02', 1);
INSERT INTO public.sockets VALUES (707, 'TrUsnM1HkePENvAqAAAB', '2025-08-08 19:48:09.014437+02', '2025-08-08 19:48:09.014437+02', 1);
INSERT INTO public.sockets VALUES (709, '064z1R5AWbLlLgzhAAAB', '2025-08-08 19:48:15.013494+02', '2025-08-08 19:48:15.013494+02', 1);
INSERT INTO public.sockets VALUES (711, '4Vj_Fd_FE3aTK8kjAAAB', '2025-08-08 19:48:25.247041+02', '2025-08-08 19:48:25.247041+02', 1);
INSERT INTO public.sockets VALUES (713, '3LwnOOXzU43Qk7GFAAAB', '2025-08-08 19:48:46.99377+02', '2025-08-08 19:48:46.99377+02', 1);
INSERT INTO public.sockets VALUES (715, '5TEepXyXfo-sQqCyAAAB', '2025-08-08 19:48:53.01793+02', '2025-08-08 19:48:53.01793+02', 1);
INSERT INTO public.sockets VALUES (717, 'qlAR9e9PVWwjywVwAAAB', '2025-08-08 19:48:57.742999+02', '2025-08-08 19:48:57.742999+02', 1);
INSERT INTO public.sockets VALUES (719, 'x-QFtGac7BLK7bfQAAAB', '2025-08-08 19:49:59.008334+02', '2025-08-08 19:49:59.008334+02', 1);
INSERT INTO public.sockets VALUES (721, 'p4vNey1O10j-ILCZAAAB', '2025-08-08 19:50:06.999752+02', '2025-08-08 19:50:06.999752+02', 1);
INSERT INTO public.sockets VALUES (723, 'XZ2kJfbKVAOwUt6WAAAB', '2025-08-08 19:50:27.004773+02', '2025-08-08 19:50:27.004773+02', 1);
INSERT INTO public.sockets VALUES (725, 'hA6dNk_0fILKySscAAAB', '2025-08-08 19:50:36.008525+02', '2025-08-08 19:50:36.008525+02', 1);
INSERT INTO public.sockets VALUES (728, 'JAcCH0fOH-BNbfc2AAAD', '2025-08-08 19:50:46.53797+02', '2025-08-08 19:50:46.53797+02', 1);
INSERT INTO public.sockets VALUES (735, 'DybnpN_7WT8Th5k_AAAD', '2025-08-08 19:53:10.862679+02', '2025-08-08 19:53:10.862679+02', 1);
INSERT INTO public.sockets VALUES (736, 'aRmayRM-f_jtOJvgAAAF', '2025-08-08 19:54:09.187006+02', '2025-08-08 19:54:09.187006+02', 1);
INSERT INTO public.sockets VALUES (762, 'VzRhmyuqwlFN1X-CAAAz', '2025-08-08 20:13:41.862649+02', '2025-08-08 20:13:41.862649+02', 1);
INSERT INTO public.sockets VALUES (764, '7pnBsvcz3wyE-E_YAAAB', '2025-08-08 20:16:07.980206+02', '2025-08-08 20:16:07.980206+02', 1);
INSERT INTO public.sockets VALUES (766, 'YWEck6PsmNakwaouAAAB', '2025-08-08 20:16:18.485638+02', '2025-08-08 20:16:18.485638+02', 1);
INSERT INTO public.sockets VALUES (768, 'iDwN2FyZh2q1MF82AAAB', '2025-08-08 20:16:28.105876+02', '2025-08-08 20:16:28.105876+02', 1);
INSERT INTO public.sockets VALUES (770, 'h5nCR5PPu9AuKZAcAAAB', '2025-08-08 20:16:49.000865+02', '2025-08-08 20:16:49.000865+02', 1);
INSERT INTO public.sockets VALUES (772, 'UJUE5YmiI1Q_KFvBAAAB', '2025-08-08 20:17:05.512036+02', '2025-08-08 20:17:05.512036+02', 1);
INSERT INTO public.sockets VALUES (774, 'x3Y9DAdADxPxxLXCAAAB', '2025-08-08 20:17:23.022413+02', '2025-08-08 20:17:23.022413+02', 1);
INSERT INTO public.sockets VALUES (776, 'Qy4HboCe9GLm7JdwAAAB', '2025-08-08 20:17:42.017878+02', '2025-08-08 20:17:42.017878+02', 1);
INSERT INTO public.sockets VALUES (778, 'EMl1ktG-znHh0R-JAAAB', '2025-08-08 20:17:45.981345+02', '2025-08-08 20:17:45.981345+02', 1);
INSERT INTO public.sockets VALUES (781, 'w-XVCjjxsV2OiGiLAAAB', '2025-08-10 11:47:50.25258+02', '2025-08-10 11:47:50.25258+02', 1);
INSERT INTO public.sockets VALUES (783, 'Q6E-D3iZJeDAOlUPAAAB', '2025-08-10 11:54:30.379617+02', '2025-08-10 11:54:30.379617+02', 1);
INSERT INTO public.sockets VALUES (785, 'N5kjtj6p0jdWZuWyAAAB', '2025-08-10 11:54:59.022086+02', '2025-08-10 11:54:59.022086+02', 1);
INSERT INTO public.sockets VALUES (673, 'D4pWtc0-0SJbIn6bAAAH', '2025-08-08 19:16:29.620818+02', '2025-08-08 19:16:29.620818+02', 1);
INSERT INTO public.sockets VALUES (675, 'gxFZ71GRk4nXF9DCAAAB', '2025-08-08 19:17:17.105638+02', '2025-08-08 19:17:17.105638+02', 1);
INSERT INTO public.sockets VALUES (677, 'f29LWtVDKjxWk_csAAAB', '2025-08-08 19:17:50.772956+02', '2025-08-08 19:17:50.772956+02', 1);
INSERT INTO public.sockets VALUES (787, 'qPgagpIf9KUs1igIAAAB', '2025-08-10 11:55:10.064998+02', '2025-08-10 11:55:10.064998+02', 1);
INSERT INTO public.sockets VALUES (789, 'jwH5utcJvlr2Iq-yAAAB', '2025-08-10 11:55:20.997268+02', '2025-08-10 11:55:20.997268+02', 1);
INSERT INTO public.sockets VALUES (791, 'tnTIUv9K2J9qEbP6AAAB', '2025-08-10 11:58:34.299046+02', '2025-08-10 11:58:34.299046+02', 1);
INSERT INTO public.sockets VALUES (796, 'TEFLr8gyyH4mk2iDAAAJ', '2025-08-10 12:03:15.554478+02', '2025-08-10 12:03:15.554478+02', 1);
INSERT INTO public.sockets VALUES (801, 'bgxTTvECxGyrzrBsAAAD', '2025-08-10 12:11:39.975025+02', '2025-08-10 12:11:39.975025+02', 1);
INSERT INTO public.sockets VALUES (814, 'eMFmUqnjjqWKWsXDAAAd', '2025-08-10 12:39:01.015522+02', '2025-08-10 12:39:01.015522+02', 2);
INSERT INTO public.sockets VALUES (816, 'GtK4cXWo0UXj-O9_AAAD', '2025-08-10 12:43:19.03588+02', '2025-08-10 12:43:19.03588+02', 1);
INSERT INTO public.sockets VALUES (819, 'ByRvzVRy2R4TkSP0AAAC', '2025-08-10 12:43:26.959162+02', '2025-08-10 12:43:26.959162+02', 2);
INSERT INTO public.sockets VALUES (821, 'vKKsYhfX3rnt2lM1AAAB', '2025-08-10 12:44:19.265314+02', '2025-08-10 12:44:19.265314+02', 1);
INSERT INTO public.sockets VALUES (824, 'U7Ds5ekXe3YD5ed6AAAB', '2025-08-10 12:44:21.978144+02', '2025-08-10 12:44:21.978144+02', 2);
INSERT INTO public.sockets VALUES (825, 'iinOFhL4JVbIEBFeAAAD', '2025-08-10 12:44:23.913778+02', '2025-08-10 12:44:23.913778+02', 1);
INSERT INTO public.sockets VALUES (830, '1U9wseHk22kKE8CRAAAJ', '2025-08-10 12:47:08.753127+02', '2025-08-10 12:47:08.753127+02', 1);
INSERT INTO public.sockets VALUES (831, 'BbPwo_RhdzNK0gqfAAAL', '2025-08-10 12:47:08.807118+02', '2025-08-10 12:47:08.807118+02', 2);
INSERT INTO public.sockets VALUES (833, 'U9u24PPWEzmkMMdIAAAG', '2025-08-10 12:47:33.242314+02', '2025-08-10 12:47:33.242314+02', 2);
INSERT INTO public.sockets VALUES (835, '-Wmc248sP3NbeWLOAAAI', '2025-08-10 12:47:33.245011+02', '2025-08-10 12:47:33.245011+02', 1);
INSERT INTO public.sockets VALUES (837, 'sdVUMcs0mKwKXbGqAAAK', '2025-08-10 12:47:33.247062+02', '2025-08-10 12:47:33.247062+02', 1);
INSERT INTO public.sockets VALUES (839, 'UMVIi_pm7LK14ftyAAAF', '2025-08-10 12:47:34.988382+02', '2025-08-10 12:47:34.988382+02', 2);
INSERT INTO public.sockets VALUES (841, '7vA7sgGzPypxnViQAAAG', '2025-08-10 12:47:34.988962+02', '2025-08-10 12:47:34.988962+02', 1);
INSERT INTO public.sockets VALUES (843, '7NV2xGKeDVG_Wg10AAAD', '2025-08-10 12:47:36.715831+02', '2025-08-10 12:47:36.715831+02', 2);
INSERT INTO public.sockets VALUES (844, 'KMJVDigYjPX0tK9gAAAH', '2025-08-10 12:47:36.906159+02', '2025-08-10 12:47:36.906159+02', 2);
INSERT INTO public.sockets VALUES (845, 'lLqrItb09GAHikDfAAAI', '2025-08-10 12:47:36.909004+02', '2025-08-10 12:47:36.909004+02', 2);
INSERT INTO public.sockets VALUES (846, 'eci68B6RPCawQSuyAAAJ', '2025-08-10 12:47:36.914242+02', '2025-08-10 12:47:36.914242+02', 1);
INSERT INTO public.sockets VALUES (847, 'CMGtXcLfSuSa5qXbAAAL', '2025-08-10 12:47:37.963818+02', '2025-08-10 12:47:37.963818+02', 1);
INSERT INTO public.sockets VALUES (848, 'u5mMCeWCDYWZ4XJ7AAAE', '2025-08-10 12:48:11.969601+02', '2025-08-10 12:48:11.969601+02', 2);
INSERT INTO public.sockets VALUES (849, 'qxivU1SGxPqzN0TzAAAF', '2025-08-10 12:48:11.970119+02', '2025-08-10 12:48:11.970119+02', 1);
INSERT INTO public.sockets VALUES (850, 'iS07dYkv5DrHxUk_AAAG', '2025-08-10 12:48:11.97036+02', '2025-08-10 12:48:11.97036+02', 2);
INSERT INTO public.sockets VALUES (851, 'D-hT2VCKJ5BgEymiAAAH', '2025-08-10 12:48:11.97083+02', '2025-08-10 12:48:11.97083+02', 1);
INSERT INTO public.sockets VALUES (852, 'oAMJN3LuUkQieewaAAAK', '2025-08-10 12:48:12.911036+02', '2025-08-10 12:48:12.911036+02', 2);
INSERT INTO public.sockets VALUES (853, 'p80KNlb1-1YcMuZyAAAL', '2025-08-10 12:48:12.917726+02', '2025-08-10 12:48:12.917726+02', 1);
INSERT INTO public.sockets VALUES (854, 'kRRIdoa_nfRNmfD1AAAG', '2025-08-10 12:48:16.966699+02', '2025-08-10 12:48:16.966699+02', 2);
INSERT INTO public.sockets VALUES (855, 'crfwynI6LVA0ivdjAAAH', '2025-08-10 12:48:16.967076+02', '2025-08-10 12:48:16.967076+02', 1);
INSERT INTO public.sockets VALUES (856, 'mXQC6l8hzVbIuFRuAAAI', '2025-08-10 12:48:16.967542+02', '2025-08-10 12:48:16.967542+02', 2);
INSERT INTO public.sockets VALUES (857, 'WmuI1yL1QANT5R2MAAAK', '2025-08-10 12:48:16.968031+02', '2025-08-10 12:48:16.968031+02', 2);
INSERT INTO public.sockets VALUES (858, 'S9WRlKZwxL_sM8F0AAAJ', '2025-08-10 12:48:16.968284+02', '2025-08-10 12:48:16.968284+02', 1);
INSERT INTO public.sockets VALUES (859, 'JR6KtKe92legprnUAAAL', '2025-08-10 12:48:16.968656+02', '2025-08-10 12:48:16.968656+02', 1);
INSERT INTO public.sockets VALUES (860, 'EJKWBQNoHFFvC9_6AAAD', '2025-08-10 12:48:20.960341+02', '2025-08-10 12:48:20.960341+02', 2);
INSERT INTO public.sockets VALUES (861, '7QdxVkGlTrD-JfQ6AAAE', '2025-08-10 12:48:20.960883+02', '2025-08-10 12:48:20.960883+02', 2);
INSERT INTO public.sockets VALUES (862, 'WfbrisFrUVABA5GDAAAF', '2025-08-10 12:48:20.961269+02', '2025-08-10 12:48:20.961269+02', 2);
INSERT INTO public.sockets VALUES (863, 'oeej7ERK9goIIYsCAAAJ', '2025-08-10 12:48:21.907742+02', '2025-08-10 12:48:21.907742+02', 1);
INSERT INTO public.sockets VALUES (864, 'GzOVmyj53EFvkwBPAAAB', '2025-08-10 12:48:22.948041+02', '2025-08-10 12:48:22.948041+02', 2);
INSERT INTO public.sockets VALUES (865, 'AheNKydkmG5GiyyXAAAG', '2025-08-10 12:48:23.914231+02', '2025-08-10 12:48:23.914231+02', 2);
INSERT INTO public.sockets VALUES (866, '6yLOUrragxSKSseGAAAH', '2025-08-10 12:48:23.929397+02', '2025-08-10 12:48:23.929397+02', 1);
INSERT INTO public.sockets VALUES (867, 'BopL9Ald1VpX9G6AAAAI', '2025-08-10 12:48:23.932832+02', '2025-08-10 12:48:23.932832+02', 2);
INSERT INTO public.sockets VALUES (868, 'BTHVM0xy0Oltd6LuAAAJ', '2025-08-10 12:48:23.934846+02', '2025-08-10 12:48:23.934846+02', 1);
INSERT INTO public.sockets VALUES (869, '1y1or2ajiDdjkVEiAAAB', '2025-08-10 12:48:25.460761+02', '2025-08-10 12:48:25.460761+02', 1);
INSERT INTO public.sockets VALUES (870, 'RTzD93aBYySQi845AAAE', '2025-08-10 12:48:25.908307+02', '2025-08-10 12:48:25.908307+02', 1);
INSERT INTO public.sockets VALUES (871, 'za5wHinfmzpvURovAAAH', '2025-08-10 12:48:25.926974+02', '2025-08-10 12:48:25.926974+02', 2);
INSERT INTO public.sockets VALUES (872, '58BPMkhREnVCGem2AAAI', '2025-08-10 12:48:25.930503+02', '2025-08-10 12:48:25.930503+02', 2);
INSERT INTO public.sockets VALUES (873, 'jHIFCEiCc4htbStYAAAJ', '2025-08-10 12:48:25.933509+02', '2025-08-10 12:48:25.933509+02', 2);
INSERT INTO public.sockets VALUES (874, 'hF50eZS3alPD9Ei7AAAL', '2025-08-10 12:48:26.913073+02', '2025-08-10 12:48:26.913073+02', 1);
INSERT INTO public.sockets VALUES (875, 'x_UbLjcgjmlhEPA4AAAC', '2025-08-10 12:48:28.210533+02', '2025-08-10 12:48:28.210533+02', 2);
INSERT INTO public.sockets VALUES (876, 'jF6NZCbl5I2Z3kVwAAAD', '2025-08-10 12:48:28.211159+02', '2025-08-10 12:48:28.211159+02', 1);
INSERT INTO public.sockets VALUES (877, 'oxlHyS2B25pT12j0AAAI', '2025-08-10 12:48:28.905765+02', '2025-08-10 12:48:28.905765+02', 2);
INSERT INTO public.sockets VALUES (878, 'piW1N3jjHb73fS64AAAJ', '2025-08-10 12:48:28.911732+02', '2025-08-10 12:48:28.911732+02', 2);
INSERT INTO public.sockets VALUES (879, 'JNfPr_QYoiNoPthEAAAK', '2025-08-10 12:48:28.916655+02', '2025-08-10 12:48:28.916655+02', 1);
INSERT INTO public.sockets VALUES (880, 'd6HuLwquxfoaOJmiAAAL', '2025-08-10 12:48:28.917097+02', '2025-08-10 12:48:28.917097+02', 1);
INSERT INTO public.sockets VALUES (881, 'OUZnu6mGpKG5rvPnAAAD', '2025-08-10 12:48:50.981198+02', '2025-08-10 12:48:50.981198+02', 2);
INSERT INTO public.sockets VALUES (882, 'VpTGFUl69OJNkWwcAAAE', '2025-08-10 12:48:50.982234+02', '2025-08-10 12:48:50.982234+02', 1);
INSERT INTO public.sockets VALUES (883, '5bCbInrbbmbh3C5ZAAAF', '2025-08-10 12:48:50.983101+02', '2025-08-10 12:48:50.983101+02', 1);
INSERT INTO public.sockets VALUES (884, '7Ekk3-rO18LXWoXUAAAJ', '2025-08-10 12:48:51.914559+02', '2025-08-10 12:48:51.914559+02', 2);
INSERT INTO public.sockets VALUES (885, 'xJCKnQRwvw88zVKYAAAK', '2025-08-10 12:48:51.921531+02', '2025-08-10 12:48:51.921531+02', 2);
INSERT INTO public.sockets VALUES (886, 'qQ5RcELBXhzp2IJQAAAL', '2025-08-10 12:48:51.922291+02', '2025-08-10 12:48:51.922291+02', 1);
INSERT INTO public.sockets VALUES (887, 'NtT1xhKD7XCS5xfVAAAF', '2025-08-10 12:48:54.964714+02', '2025-08-10 12:48:54.964714+02', 2);
INSERT INTO public.sockets VALUES (888, 'ZiMq7csKZhxXKOpeAAAG', '2025-08-10 12:48:54.96495+02', '2025-08-10 12:48:54.96495+02', 1);
INSERT INTO public.sockets VALUES (889, 'rrlw92yHPpu7SIakAAAH', '2025-08-10 12:48:54.965233+02', '2025-08-10 12:48:54.965233+02', 2);
INSERT INTO public.sockets VALUES (890, 'uZvFHnME6nKLoUqUAAAI', '2025-08-10 12:48:54.965737+02', '2025-08-10 12:48:54.965737+02', 1);
INSERT INTO public.sockets VALUES (891, 'Re4-dJTAMIGxyKuyAAAJ', '2025-08-10 12:48:54.966166+02', '2025-08-10 12:48:54.966166+02', 1);
INSERT INTO public.sockets VALUES (892, 'X1HmNsx8xBsqwCX_AAAL', '2025-08-10 12:48:55.902855+02', '2025-08-10 12:48:55.902855+02', 2);
INSERT INTO public.sockets VALUES (893, 'd90j-v1qkgIjYSFeAAAB', '2025-08-10 12:49:00.209631+02', '2025-08-10 12:49:00.209631+02', 1);
INSERT INTO public.sockets VALUES (894, '6U_14ROwr6cODMsnAAAF', '2025-08-10 12:49:01.758198+02', '2025-08-10 12:49:01.758198+02', 2);
INSERT INTO public.sockets VALUES (895, 'hG8ZHXZZNpSRm_k5AAAG', '2025-08-10 12:49:01.758502+02', '2025-08-10 12:49:01.758502+02', 2);
INSERT INTO public.sockets VALUES (896, 'InGGZceRbtcPyxMlAAAH', '2025-08-10 12:49:01.758903+02', '2025-08-10 12:49:01.758903+02', 1);
INSERT INTO public.sockets VALUES (898, 'I4CGz570NT6oV2YRAAAJ', '2025-08-10 12:49:01.760093+02', '2025-08-10 12:49:01.760093+02', 1);
INSERT INTO public.sockets VALUES (897, 'O3mBlttgHI5gGXeGAAAI', '2025-08-10 12:49:01.75955+02', '2025-08-10 12:49:01.75955+02', 2);
INSERT INTO public.sockets VALUES (899, 'wqzqYEVV9F-iIjEJAAAL', '2025-08-10 12:49:01.913506+02', '2025-08-10 12:49:01.913506+02', 1);
INSERT INTO public.sockets VALUES (900, 'U6xC-YP2yg2NfUa6AAAE', '2025-08-10 12:49:05.999922+02', '2025-08-10 12:49:05.999922+02', 2);
INSERT INTO public.sockets VALUES (901, 'qmLP7l5wZR0ZpULYAAAF', '2025-08-10 12:49:06.000367+02', '2025-08-10 12:49:06.000367+02', 1);
INSERT INTO public.sockets VALUES (902, 'swaPJwhhi1gM7m7zAAAG', '2025-08-10 12:49:06.000698+02', '2025-08-10 12:49:06.000698+02', 1);
INSERT INTO public.sockets VALUES (903, 'IHN6hLPrQhYp60FiAAAH', '2025-08-10 12:49:06.002153+02', '2025-08-10 12:49:06.002153+02', 1);
INSERT INTO public.sockets VALUES (905, 'oknC-teipUiym_MHAAAL', '2025-08-10 12:49:06.918354+02', '2025-08-10 12:49:06.918354+02', 2);
INSERT INTO public.sockets VALUES (904, 'iOrQhXg9PcmmUyj5AAAK', '2025-08-10 12:49:06.918056+02', '2025-08-10 12:49:06.918056+02', 2);
INSERT INTO public.sockets VALUES (970, 'HeC4gZLtQu9h371JAAAB', '2025-08-18 17:20:29.550809+02', '2025-08-18 17:20:29.550809+02', 3);
INSERT INTO public.sockets VALUES (971, 'UV-dLtXP2ugevc9fAAAD', '2025-08-18 17:20:51.242381+02', '2025-08-18 17:20:51.242381+02', 4);
INSERT INTO public.sockets VALUES (972, 'PcetU2hOBgC87e-zAAAB', '2025-08-18 17:22:40.627214+02', '2025-08-18 17:22:40.627214+02', 4);
INSERT INTO public.sockets VALUES (973, '4ASTVoYfPp3hxdIVAAAD', '2025-08-18 17:22:41.565488+02', '2025-08-18 17:22:41.565488+02', 3);
INSERT INTO public.sockets VALUES (974, 'keWeGAfk_UXeEk9kAAAB', '2025-08-18 17:22:49.114595+02', '2025-08-18 17:22:49.114595+02', 3);
INSERT INTO public.sockets VALUES (975, 'yP3zBO9A4BpgLdJcAAAD', '2025-08-18 17:22:49.571028+02', '2025-08-18 17:22:49.571028+02', 4);
INSERT INTO public.sockets VALUES (976, 'k6i4yteTTQhDpvn_AAAB', '2025-08-18 17:22:53.634197+02', '2025-08-18 17:22:53.634197+02', 4);
INSERT INTO public.sockets VALUES (977, 'dFHSe7us2MLJ1LHtAAAD', '2025-08-18 17:22:54.569735+02', '2025-08-18 17:22:54.569735+02', 3);
INSERT INTO public.sockets VALUES (978, 'P89KB4xjoWrjEZPNAAAC', '2025-08-18 17:22:56.622317+02', '2025-08-18 17:22:56.622317+02', 4);
INSERT INTO public.sockets VALUES (979, 'fMs1TiqU1Y_iXqnnAAAD', '2025-08-18 17:22:56.622765+02', '2025-08-18 17:22:56.622765+02', 3);
INSERT INTO public.sockets VALUES (980, 'xGWxoFycYaPc5D5WAAAB', '2025-08-18 17:24:11.62671+02', '2025-08-18 17:24:11.62671+02', 4);
INSERT INTO public.sockets VALUES (981, 'QwnKLvoFloMqRLxSAAAD', '2025-08-18 17:24:12.5844+02', '2025-08-18 17:24:12.5844+02', 3);
INSERT INTO public.sockets VALUES (984, 'ggx7m8Ut2AvWKkihAAAF', '2025-08-18 17:24:17.39628+02', '2025-08-18 17:24:17.39628+02', 4);
INSERT INTO public.sockets VALUES (985, 'FjOBrE1atoMKA23bAAAH', '2025-08-18 17:32:07.174245+02', '2025-08-18 17:32:07.174245+02', 3);
INSERT INTO public.sockets VALUES (1007, '0T0eOO8TBT_SC4-zAAAz', '2025-08-18 17:55:43.95825+02', '2025-08-18 17:55:43.95825+02', 3);
INSERT INTO public.sockets VALUES (1008, '7Pc_YwW5EXOBP5ZiAAAD', '2025-08-18 17:57:12.620915+02', '2025-08-18 17:57:12.620915+02', 3);
INSERT INTO public.sockets VALUES (1009, 'tMCZwg2W32JAMWteAAAE', '2025-08-18 17:57:12.621472+02', '2025-08-18 17:57:12.621472+02', 3);
INSERT INTO public.sockets VALUES (1010, 'duWHcicJS-G9h112AAAF', '2025-08-18 17:57:12.621926+02', '2025-08-18 17:57:12.621926+02', 4);
INSERT INTO public.sockets VALUES (1011, 'efPKMnmpSbLqIAaKAAAB', '2025-08-18 17:57:16.613004+02', '2025-08-18 17:57:16.613004+02', 3);
INSERT INTO public.sockets VALUES (1012, 'o4RkqiMKLhu9H29QAAAE', '2025-08-18 17:57:17.64623+02', '2025-08-18 17:57:17.64623+02', 3);
INSERT INTO public.sockets VALUES (1013, 'eqZOadtjWtaq-WjeAAAF', '2025-08-18 17:57:17.655636+02', '2025-08-18 17:57:17.655636+02', 4);
INSERT INTO public.sockets VALUES (1014, 'FHVfh6rBQ1GxMFVMAAAB', '2025-08-18 17:57:20.859563+02', '2025-08-18 17:57:20.859563+02', 3);
INSERT INTO public.sockets VALUES (1015, '68_o5jEXDlEfef0eAAAE', '2025-08-18 17:57:21.58227+02', '2025-08-18 17:57:21.58227+02', 3);
INSERT INTO public.sockets VALUES (1016, '0dvtb0q-KILnWCXPAAAF', '2025-08-18 17:57:21.583007+02', '2025-08-18 17:57:21.583007+02', 4);
INSERT INTO public.sockets VALUES (1017, 'kvnLb0L7Y-Six4vzAAAB', '2025-08-18 17:57:22.860989+02', '2025-08-18 17:57:22.860989+02', 3);
INSERT INTO public.sockets VALUES (1018, 'i9xQUdbggrJ53P9gAAAC', '2025-08-18 17:57:24.364574+02', '2025-08-18 17:57:24.364574+02', 3);
INSERT INTO public.sockets VALUES (1019, 'rFjYAdmJcdjLeB74AAAD', '2025-08-18 17:57:24.365126+02', '2025-08-18 17:57:24.365126+02', 4);
INSERT INTO public.sockets VALUES (1021, '40xvqy7HfiR1LH4XAAAD', '2025-08-18 17:57:26.619356+02', '2025-08-18 17:57:26.619356+02', 3);
INSERT INTO public.sockets VALUES (1025, 'BDWk1i2WdXOAjEnRAAAL', '2025-08-18 17:58:52.26925+02', '2025-08-18 17:58:52.26925+02', 4);
INSERT INTO public.sockets VALUES (1028, 'V-x7uQPmIDtV-SyrAAAR', '2025-08-18 18:00:17.030172+02', '2025-08-18 18:00:17.030172+02', 3);
INSERT INTO public.sockets VALUES (1029, '__wVzgFvHlHARQzjAAAT', '2025-08-18 18:02:01.663564+02', '2025-08-18 18:02:01.663564+02', 1);
INSERT INTO public.sockets VALUES (1030, 'tSVik1yCypBH7v28AAAE', '2025-08-18 18:03:29.641448+02', '2025-08-18 18:03:29.641448+02', 1);
INSERT INTO public.sockets VALUES (1031, 'd_iK4Zef96CuL_zwAAAF', '2025-08-18 18:03:29.642042+02', '2025-08-18 18:03:29.642042+02', 3);
INSERT INTO public.sockets VALUES (1032, '7wvET6cuq8h93NsfAAAG', '2025-08-18 18:03:29.64231+02', '2025-08-18 18:03:29.64231+02', 3);
INSERT INTO public.sockets VALUES (1033, 'uREY_C0VQeOMLKMbAAAH', '2025-08-18 18:03:31.614746+02', '2025-08-18 18:03:31.614746+02', 4);
INSERT INTO public.sockets VALUES (1034, 'ELMrwsHUZDIfnmZZAAAD', '2025-08-18 18:04:21.632478+02', '2025-08-18 18:04:21.632478+02', 3);
INSERT INTO public.sockets VALUES (1035, 'XtpRZ_Hj-MgmgoICAAAE', '2025-08-18 18:04:21.632954+02', '2025-08-18 18:04:21.632954+02', 3);
INSERT INTO public.sockets VALUES (1036, '4veASisTweQYnD1mAAAG', '2025-08-18 18:04:22.571052+02', '2025-08-18 18:04:22.571052+02', 1);
INSERT INTO public.sockets VALUES (1037, 'qsdYL_hdVtduKNj9AAAH', '2025-08-18 18:04:23.630116+02', '2025-08-18 18:04:23.630116+02', 4);
INSERT INTO public.sockets VALUES (1038, 'xYNfYo8AXgqhmzOBAAAB', '2025-08-18 18:04:43.868571+02', '2025-08-18 18:04:43.868571+02', 1);
INSERT INTO public.sockets VALUES (1039, '17ewkLts7kXdVhOIAAAF', '2025-08-18 18:04:44.572694+02', '2025-08-18 18:04:44.572694+02', 3);
INSERT INTO public.sockets VALUES (1040, '75g2njBdMYQDpIP4AAAG', '2025-08-18 18:04:44.578902+02', '2025-08-18 18:04:44.578902+02', 3);
INSERT INTO public.sockets VALUES (1041, '58RZAqXDhE8PMuJcAAAD', '2025-08-18 18:04:47.620381+02', '2025-08-18 18:04:47.620381+02', 1);
INSERT INTO public.sockets VALUES (1042, '7qmL9I2C7Z0e-4BSAAAE', '2025-08-18 18:04:47.625733+02', '2025-08-18 18:04:47.625733+02', 3);
INSERT INTO public.sockets VALUES (1043, 'aY-EyDSslRvT7vNRAAAF', '2025-08-18 18:04:47.626785+02', '2025-08-18 18:04:47.626785+02', 3);
INSERT INTO public.sockets VALUES (1044, 'gU6i1AKHXRgOUnnYAAAC', '2025-08-18 18:04:50.62381+02', '2025-08-18 18:04:50.62381+02', 1);
INSERT INTO public.sockets VALUES (1045, 'kePg_D3itC5XLhALAAAF', '2025-08-18 18:04:51.569578+02', '2025-08-18 18:04:51.569578+02', 3);
INSERT INTO public.sockets VALUES (1046, 'uVnq5CXOguwS6wbiAAAG', '2025-08-18 18:04:51.577457+02', '2025-08-18 18:04:51.577457+02', 3);
INSERT INTO public.sockets VALUES (1047, 'sxTc4VYV3BBw1HNXAAAC', '2025-08-18 18:04:53.63017+02', '2025-08-18 18:04:53.63017+02', 3);
INSERT INTO public.sockets VALUES (1048, 'irFhrf3YJH-k-WaUAAAD', '2025-08-18 18:04:53.63065+02', '2025-08-18 18:04:53.63065+02', 3);
INSERT INTO public.sockets VALUES (1049, 'JHyeV-14ssELb275AAAF', '2025-08-18 18:04:54.581857+02', '2025-08-18 18:04:54.581857+02', 1);
INSERT INTO public.sockets VALUES (1050, 'CgGkCKoFE0s3G1AUAAAB', '2025-08-18 18:04:55.60584+02', '2025-08-18 18:04:55.60584+02', 3);
INSERT INTO public.sockets VALUES (1051, '3Z-Te0Im6ZRYad0FAAAE', '2025-08-18 18:04:56.571234+02', '2025-08-18 18:04:56.571234+02', 1);
INSERT INTO public.sockets VALUES (1052, 'VZ7X9A5DaceTJuOWAAAF', '2025-08-18 18:04:56.576172+02', '2025-08-18 18:04:56.576172+02', 3);
INSERT INTO public.sockets VALUES (1053, 'TASTXvaGDGXXhd3qAAAD', '2025-08-18 18:05:00.620967+02', '2025-08-18 18:05:00.620967+02', 1);
INSERT INTO public.sockets VALUES (1054, 'Lesvj85mRVqTVIkMAAAE', '2025-08-18 18:05:00.621541+02', '2025-08-18 18:05:00.621541+02', 3);
INSERT INTO public.sockets VALUES (1055, '9n1kLr9oKP114NSnAAAF', '2025-08-18 18:05:00.62192+02', '2025-08-18 18:05:00.62192+02', 3);
INSERT INTO public.sockets VALUES (1056, 'bmxKQCpofrJikyygAAAB', '2025-08-18 18:05:02.60704+02', '2025-08-18 18:05:02.60704+02', 1);
INSERT INTO public.sockets VALUES (1057, 'waq4ON5OUDla9opfAAAC', '2025-08-18 18:05:03.865097+02', '2025-08-18 18:05:03.865097+02', 3);
INSERT INTO public.sockets VALUES (1058, 'Gu9b9rJvRhpJbUokAAAD', '2025-08-18 18:05:03.865594+02', '2025-08-18 18:05:03.865594+02', 3);
INSERT INTO public.sockets VALUES (1059, '1Ht-D4REaw73ZgM0AAAG', '2025-08-18 18:05:04.569854+02', '2025-08-18 18:05:04.569854+02', 1);
INSERT INTO public.sockets VALUES (1060, 'VT7j7Is-OTX30-2dAAAH', '2025-08-18 18:05:05.940047+02', '2025-08-18 18:05:05.940047+02', 4);
INSERT INTO public.sockets VALUES (1061, 'hvjrqT5Wn6cbgk9vAAAD', '2025-08-18 18:05:07.634017+02', '2025-08-18 18:05:07.634017+02', 1);
INSERT INTO public.sockets VALUES (1062, 'dncLT28BsLkQUD8ZAAAE', '2025-08-18 18:05:07.63457+02', '2025-08-18 18:05:07.63457+02', 3);
INSERT INTO public.sockets VALUES (1063, 'Aa1K0UtYidhnIWcCAAAF', '2025-08-18 18:05:07.634846+02', '2025-08-18 18:05:07.634846+02', 3);
INSERT INTO public.sockets VALUES (1064, 'Tcs05yB3h2Ja_2m7AAAH', '2025-08-18 18:05:13.617401+02', '2025-08-18 18:05:13.617401+02', 4);
INSERT INTO public.sockets VALUES (1065, 'RN6w6R13O27OYQ68AAAC', '2025-08-18 18:05:27.612167+02', '2025-08-18 18:05:27.612167+02', 3);
INSERT INTO public.sockets VALUES (1066, '-Zrs6rJxOF9sbAbTAAAF', '2025-08-18 18:05:28.573455+02', '2025-08-18 18:05:28.573455+02', 1);
INSERT INTO public.sockets VALUES (1067, '3s1i_4Dr5xtmGHLOAAAG', '2025-08-18 18:05:28.578554+02', '2025-08-18 18:05:28.578554+02', 3);
INSERT INTO public.sockets VALUES (1068, 'zxuvoV2kWNwdfj6hAAAD', '2025-08-18 18:05:30.610932+02', '2025-08-18 18:05:30.610932+02', 3);
INSERT INTO public.sockets VALUES (1069, 'biBaycdXwrk29_G7AAAE', '2025-08-18 18:05:30.611478+02', '2025-08-18 18:05:30.611478+02', 3);
INSERT INTO public.sockets VALUES (1070, 'Iy7yUm669UwsbzWgAAAF', '2025-08-18 18:05:30.611911+02', '2025-08-18 18:05:30.611911+02', 1);
INSERT INTO public.sockets VALUES (1071, 'yo7njaVyYF9dZhEzAAAH', '2025-08-18 18:05:34.974643+02', '2025-08-18 18:05:34.974643+02', 4);
INSERT INTO public.sockets VALUES (1072, '1Yv4Ib5UzAiKyOYXAAAE', '2025-08-18 18:05:59.633571+02', '2025-08-18 18:05:59.633571+02', 1);
INSERT INTO public.sockets VALUES (1073, '0rqbMrRVc5GeRm1SAAAF', '2025-08-18 18:05:59.634171+02', '2025-08-18 18:05:59.634171+02', 3);
INSERT INTO public.sockets VALUES (1074, 'vQuYasQAr-O81l-UAAAH', '2025-08-18 18:05:59.634588+02', '2025-08-18 18:05:59.634588+02', 3);
INSERT INTO public.sockets VALUES (1075, 'mlXlJ_qfoC0MW6_2AAAG', '2025-08-18 18:05:59.63517+02', '2025-08-18 18:05:59.63517+02', 4);
INSERT INTO public.sockets VALUES (1076, 'LZdAkIpg23ZzatnoAAAE', '2025-08-18 18:06:03.631394+02', '2025-08-18 18:06:03.631394+02', 1);
INSERT INTO public.sockets VALUES (1077, '1PzKwW5dRBpVlLx6AAAF', '2025-08-18 18:06:03.631962+02', '2025-08-18 18:06:03.631962+02', 3);
INSERT INTO public.sockets VALUES (1078, 'N60qpzx_clebk5oyAAAG', '2025-08-18 18:06:03.632275+02', '2025-08-18 18:06:03.632275+02', 4);
INSERT INTO public.sockets VALUES (1079, 'Zq5MY1RudBuI7UCaAAAH', '2025-08-18 18:06:03.63259+02', '2025-08-18 18:06:03.63259+02', 3);
INSERT INTO public.sockets VALUES (1080, 'BlZQNkJYsntQ7l_wAAAC', '2025-08-18 18:06:13.617332+02', '2025-08-18 18:06:13.617332+02', 3);
INSERT INTO public.sockets VALUES (1081, 'gOvntw_yehsJ0C2DAAAD', '2025-08-18 18:06:13.617751+02', '2025-08-18 18:06:13.617751+02', 4);
INSERT INTO public.sockets VALUES (1082, 'IfAgPvvNf60ABKSGAAAG', '2025-08-18 18:06:14.568344+02', '2025-08-18 18:06:14.568344+02', 3);
INSERT INTO public.sockets VALUES (1083, 'AvorQBNZ9r-funixAAAH', '2025-08-18 18:06:14.569023+02', '2025-08-18 18:06:14.569023+02', 1);
INSERT INTO public.sockets VALUES (1084, 'k-El3DNylVEShYQgAAAD', '2025-08-18 18:06:45.120444+02', '2025-08-18 18:06:45.120444+02', 3);
INSERT INTO public.sockets VALUES (1085, 'croz67YrbvVKeg3kAAAE', '2025-08-18 18:06:45.120899+02', '2025-08-18 18:06:45.120899+02', 4);
INSERT INTO public.sockets VALUES (1086, 'pbj8-C-kimvha3lFAAAF', '2025-08-18 18:06:45.121305+02', '2025-08-18 18:06:45.121305+02', 3);
INSERT INTO public.sockets VALUES (1087, 'AA6YxdQJirCek3LeAAAH', '2025-08-18 18:06:45.596666+02', '2025-08-18 18:06:45.596666+02', 1);
INSERT INTO public.sockets VALUES (1088, 'LpsoqdEMLUQ7TuRFAAAE', '2025-08-18 18:06:48.653457+02', '2025-08-18 18:06:48.653457+02', 1);
INSERT INTO public.sockets VALUES (1089, 'qOmLphHpR5qU2CU_AAAF', '2025-08-18 18:06:48.653948+02', '2025-08-18 18:06:48.653948+02', 3);
INSERT INTO public.sockets VALUES (1090, 'BvshM2Yi8m5cSPkbAAAG', '2025-08-18 18:06:48.654264+02', '2025-08-18 18:06:48.654264+02', 3);
INSERT INTO public.sockets VALUES (1091, 'I7LaHBUwF_l3E2Z7AAAH', '2025-08-18 18:06:48.654684+02', '2025-08-18 18:06:48.654684+02', 4);
INSERT INTO public.sockets VALUES (1092, 'bV9bSqS7pePIA0H1AAAD', '2025-08-18 18:07:09.635484+02', '2025-08-18 18:07:09.635484+02', 1);
INSERT INTO public.sockets VALUES (1093, 'MvJcyerXKxtWa5LYAAAE', '2025-08-18 18:07:09.636243+02', '2025-08-18 18:07:09.636243+02', 3);
INSERT INTO public.sockets VALUES (1094, 'at3tVyfUWTFm0I7pAAAF', '2025-08-18 18:07:09.636711+02', '2025-08-18 18:07:09.636711+02', 4);
INSERT INTO public.sockets VALUES (1095, 'QEhM4BBpot3Prm9hAAAH', '2025-08-18 18:07:10.576485+02', '2025-08-18 18:07:10.576485+02', 3);
INSERT INTO public.sockets VALUES (1096, 'qw6mIuVgWDuZtd4hAAAB', '2025-08-18 18:07:12.867559+02', '2025-08-18 18:07:12.867559+02', 1);
INSERT INTO public.sockets VALUES (1097, 'NNKFpZsYHteuybK5AAAF', '2025-08-18 18:07:13.576864+02', '2025-08-18 18:07:13.576864+02', 3);
INSERT INTO public.sockets VALUES (1098, '1HJCVPqhC29znlWUAAAG', '2025-08-18 18:07:13.586835+02', '2025-08-18 18:07:13.586835+02', 3);
INSERT INTO public.sockets VALUES (1099, 'EVbZpfGoYwYsrv6fAAAH', '2025-08-18 18:07:13.615575+02', '2025-08-18 18:07:13.615575+02', 4);
INSERT INTO public.sockets VALUES (1100, 'MLAcdAxK_imaDE-uAAAE', '2025-08-18 18:07:17.624786+02', '2025-08-18 18:07:17.624786+02', 1);
INSERT INTO public.sockets VALUES (1101, '4fHp0cepDOZUD1haAAAF', '2025-08-18 18:07:17.625345+02', '2025-08-18 18:07:17.625345+02', 3);
INSERT INTO public.sockets VALUES (1102, 'MTQzqTup4I44vYUzAAAG', '2025-08-18 18:07:17.625794+02', '2025-08-18 18:07:17.625794+02', 3);
INSERT INTO public.sockets VALUES (1103, 'gVolTo8Ieb2yJBCkAAAH', '2025-08-18 18:07:17.626276+02', '2025-08-18 18:07:17.626276+02', 4);
INSERT INTO public.sockets VALUES (1104, 'PH8OoIS53jTOLJo0AAAD', '2025-08-18 18:07:19.693369+02', '2025-08-18 18:07:19.693369+02', 3);
INSERT INTO public.sockets VALUES (1105, 'mFmAIiamOkhIolQxAAAE', '2025-08-18 18:07:19.693924+02', '2025-08-18 18:07:19.693924+02', 3);
INSERT INTO public.sockets VALUES (1106, 'FCh1F0Vc0BkWkAArAAAF', '2025-08-18 18:07:19.694268+02', '2025-08-18 18:07:19.694268+02', 4);
INSERT INTO public.sockets VALUES (1107, 'JA4kOrQCU5VecmllAAAH', '2025-08-18 18:07:20.566037+02', '2025-08-18 18:07:20.566037+02', 1);
INSERT INTO public.sockets VALUES (1108, '0SVVRld7Tl9vI3GqAAAD', '2025-08-18 18:07:22.650596+02', '2025-08-18 18:07:22.650596+02', 1);
INSERT INTO public.sockets VALUES (1109, 'qBstN8lrJJ6akcCKAAAF', '2025-08-18 18:07:22.654447+02', '2025-08-18 18:07:22.654447+02', 4);
INSERT INTO public.sockets VALUES (1110, '5dI_oHTjBscE14paAAAE', '2025-08-18 18:07:22.654945+02', '2025-08-18 18:07:22.654945+02', 3);
INSERT INTO public.sockets VALUES (1111, 'nkvle20ptLKiVaY_AAAH', '2025-08-18 18:07:23.580941+02', '2025-08-18 18:07:23.580941+02', 3);
INSERT INTO public.sockets VALUES (1112, '9p-t-phI8YKgeS5jAAAC', '2025-08-18 18:07:24.616033+02', '2025-08-18 18:07:24.616033+02', 3);
INSERT INTO public.sockets VALUES (1113, 'jo265DqdUluZO05aAAAD', '2025-08-18 18:07:24.616501+02', '2025-08-18 18:07:24.616501+02', 1);
INSERT INTO public.sockets VALUES (1114, 'zxihE6KC0BzLLnATAAAC', '2025-08-18 18:07:26.130142+02', '2025-08-18 18:07:26.130142+02', 3);
INSERT INTO public.sockets VALUES (1115, 'fuusCRWXoeZDp2cJAAAD', '2025-08-18 18:07:26.13055+02', '2025-08-18 18:07:26.13055+02', 4);
INSERT INTO public.sockets VALUES (1116, '7bfz9AMwwP7SVQdhAAAF', '2025-08-18 18:07:26.571091+02', '2025-08-18 18:07:26.571091+02', 1);
INSERT INTO public.sockets VALUES (1117, 'RZJQgGoJxxm-_L6BAAAH', '2025-08-18 18:07:27.568428+02', '2025-08-18 18:07:27.568428+02', 3);
INSERT INTO public.sockets VALUES (1118, 'pixY7Mw9qbLDfK1fAAAB', '2025-08-18 18:07:28.606997+02', '2025-08-18 18:07:28.606997+02', 1);
INSERT INTO public.sockets VALUES (1119, 'h9Kp8CyBaFI1pppSAAAF', '2025-08-18 18:07:29.570773+02', '2025-08-18 18:07:29.570773+02', 4);
INSERT INTO public.sockets VALUES (1120, 'OnmlXMwawxRNrk8yAAAG', '2025-08-18 18:07:29.578991+02', '2025-08-18 18:07:29.578991+02', 3);
INSERT INTO public.sockets VALUES (1121, 'nVP9asDjplo6fhA3AAAH', '2025-08-18 18:07:29.585075+02', '2025-08-18 18:07:29.585075+02', 3);
INSERT INTO public.sockets VALUES (1122, 'geXj5pPuPdt6n7BaAAAB', '2025-08-18 18:07:38.631826+02', '2025-08-18 18:07:38.631826+02', 3);
INSERT INTO public.sockets VALUES (1123, 'pzU6SlicjW2o5EVaAAAF', '2025-08-18 18:07:39.568129+02', '2025-08-18 18:07:39.568129+02', 1);
INSERT INTO public.sockets VALUES (1124, 'CNLh4BO_GNtn_4tFAAAG', '2025-08-18 18:07:39.579971+02', '2025-08-18 18:07:39.579971+02', 3);
INSERT INTO public.sockets VALUES (1125, 'N-rnn5fAT-VRdPA-AAAH', '2025-08-18 18:07:39.584749+02', '2025-08-18 18:07:39.584749+02', 4);
INSERT INTO public.sockets VALUES (1126, 'q31D2pm5OPF0gWSOAAAE', '2025-08-18 18:07:41.621615+02', '2025-08-18 18:07:41.621615+02', 1);
INSERT INTO public.sockets VALUES (1127, 'wjYbQbmf6G_CYJ_7AAAF', '2025-08-18 18:07:41.621962+02', '2025-08-18 18:07:41.621962+02', 3);
INSERT INTO public.sockets VALUES (1128, 'SGuuevN3VJ1BBYPOAAAG', '2025-08-18 18:07:41.622306+02', '2025-08-18 18:07:41.622306+02', 3);
INSERT INTO public.sockets VALUES (1129, 'B3e2jEk7N86ca4O-AAAH', '2025-08-18 18:07:41.622578+02', '2025-08-18 18:07:41.622578+02', 4);
INSERT INTO public.sockets VALUES (1130, '7Q_bth6cz0NwkBATAAAC', '2025-08-18 18:07:43.618587+02', '2025-08-18 18:07:43.618587+02', 1);
INSERT INTO public.sockets VALUES (1131, 'SlkjLiCCQRvIrF9yAAAD', '2025-08-18 18:07:43.619031+02', '2025-08-18 18:07:43.619031+02', 3);
INSERT INTO public.sockets VALUES (1132, '-4rY23-a7M6cdv3LAAAG', '2025-08-18 18:07:44.570464+02', '2025-08-18 18:07:44.570464+02', 3);
INSERT INTO public.sockets VALUES (1133, 'CdFPM0WxRbaY6VrSAAAH', '2025-08-18 18:07:44.578512+02', '2025-08-18 18:07:44.578512+02', 4);
INSERT INTO public.sockets VALUES (1134, '2vDgqBLLf5VFIp6RAAAB', '2025-08-18 18:07:54.626755+02', '2025-08-18 18:07:54.626755+02', 4);
INSERT INTO public.sockets VALUES (1135, 'xWINexqYnE7OyQvbAAAF', '2025-08-18 18:07:55.577885+02', '2025-08-18 18:07:55.577885+02', 3);
INSERT INTO public.sockets VALUES (1136, '2REbterUTYL-WBe7AAAG', '2025-08-18 18:07:55.58085+02', '2025-08-18 18:07:55.58085+02', 1);
INSERT INTO public.sockets VALUES (1137, 'QeM19iWMMebsvR8nAAAH', '2025-08-18 18:07:55.58504+02', '2025-08-18 18:07:55.58504+02', 3);
INSERT INTO public.sockets VALUES (1138, 'vnFGPMqkt6ipDuXUAAAB', '2025-08-18 18:07:56.874821+02', '2025-08-18 18:07:56.874821+02', 1);
INSERT INTO public.sockets VALUES (1139, 'khw9ngVx_P4-ViGJAAAD', '2025-08-18 18:07:58.391513+02', '2025-08-18 18:07:58.391513+02', 3);
INSERT INTO public.sockets VALUES (1140, 'XvwFj_ONo0G5bw-BAAAE', '2025-08-18 18:07:58.392193+02', '2025-08-18 18:07:58.392193+02', 4);
INSERT INTO public.sockets VALUES (1141, 'BPyKdA7B-EPq5DHPAAAF', '2025-08-18 18:07:58.392594+02', '2025-08-18 18:07:58.392594+02', 3);
INSERT INTO public.sockets VALUES (1142, '13sgnc77h2aFl5ksAAAD', '2025-08-18 18:07:59.636079+02', '2025-08-18 18:07:59.636079+02', 1);
INSERT INTO public.sockets VALUES (1143, 'CKpyKS1hiw-2fZn8AAAE', '2025-08-18 18:07:59.636565+02', '2025-08-18 18:07:59.636565+02', 3);
INSERT INTO public.sockets VALUES (1144, 'VxKOJpZUyo9HmmeEAAAF', '2025-08-18 18:07:59.637008+02', '2025-08-18 18:07:59.637008+02', 3);
INSERT INTO public.sockets VALUES (1145, 'YoV01tRhJju16KTrAAAC', '2025-08-18 18:08:00.631173+02', '2025-08-18 18:08:00.631173+02', 3);
INSERT INTO public.sockets VALUES (1146, 'Cwr0A9Fri9iYqKMkAAAD', '2025-08-18 18:08:00.631628+02', '2025-08-18 18:08:00.631628+02', 4);
INSERT INTO public.sockets VALUES (1147, '12Y-rMKZqqa3gOskAAAB', '2025-08-18 18:08:01.871594+02', '2025-08-18 18:08:01.871594+02', 1);
INSERT INTO public.sockets VALUES (1148, 'XD7sJyIS-4G-YyBXAAAF', '2025-08-18 18:08:02.597194+02', '2025-08-18 18:08:02.597194+02', 3);
INSERT INTO public.sockets VALUES (1149, 'Y6jvLOL_DCmf1g0XAAAG', '2025-08-18 18:08:02.606854+02', '2025-08-18 18:08:02.606854+02', 3);
INSERT INTO public.sockets VALUES (1150, 'IwDzWzURMJy7sRQ7AAAH', '2025-08-18 18:08:02.611301+02', '2025-08-18 18:08:02.611301+02', 4);
INSERT INTO public.sockets VALUES (1151, 'pHpzYQt7w6FCTdkEAAAE', '2025-08-18 18:08:05.627253+02', '2025-08-18 18:08:05.627253+02', 1);
INSERT INTO public.sockets VALUES (1152, 'Mgc5Gq2EEKKOnhp1AAAF', '2025-08-18 18:08:05.627737+02', '2025-08-18 18:08:05.627737+02', 3);
INSERT INTO public.sockets VALUES (1154, '3mSawGvn5W0LnPuOAAAH', '2025-08-18 18:08:05.62932+02', '2025-08-18 18:08:05.62932+02', 4);
INSERT INTO public.sockets VALUES (1153, 'HC9yhXNdiU0Nrx9eAAAG', '2025-08-18 18:08:05.628754+02', '2025-08-18 18:08:05.628754+02', 3);
INSERT INTO public.sockets VALUES (1155, '1qTOkTHTi0Vxa64nAAAD', '2025-08-18 18:08:14.633458+02', '2025-08-18 18:08:14.633458+02', 1);
INSERT INTO public.sockets VALUES (1156, 'Kc2hcdYlKAe3KcmhAAAE', '2025-08-18 18:08:14.633926+02', '2025-08-18 18:08:14.633926+02', 3);
INSERT INTO public.sockets VALUES (1157, 'IBX2jq2Z7DBog9YbAAAF', '2025-08-18 18:08:14.634376+02', '2025-08-18 18:08:14.634376+02', 4);
INSERT INTO public.sockets VALUES (1158, '5wzdW9Cxkz7enuXqAAAH', '2025-08-18 18:08:15.577089+02', '2025-08-18 18:08:15.577089+02', 3);
INSERT INTO public.sockets VALUES (1191, '8uuNs2ZByl5N1SIeAABB', '2025-08-18 18:14:53.2665+02', '2025-08-18 18:14:53.2665+02', 1);
INSERT INTO public.sockets VALUES (1196, 'qb84MltnuHAHz9XdAABL', '2025-08-18 18:16:06.310982+02', '2025-08-18 18:16:06.310982+02', 3);
INSERT INTO public.sockets VALUES (1203, 'Y4vPbIL5XBYWTqY1AAAN', '2025-08-18 18:33:03.886065+02', '2025-08-18 18:33:03.886065+02', 1);
INSERT INTO public.sockets VALUES (1214, 'QqAvb23KGj5_-k0fAAAj', '2025-08-18 18:43:59.064781+02', '2025-08-18 18:43:59.064781+02', 6);
INSERT INTO public.sockets VALUES (1217, 'QCQ6zIEwDAMTp7TCAAAp', '2025-08-18 18:47:06.139985+02', '2025-08-18 18:47:06.139985+02', 1);
INSERT INTO public.sockets VALUES (1219, 'FHFwUSxsqRb2azlEAAAt', '2025-08-18 18:47:06.206664+02', '2025-08-18 18:47:06.206664+02', 6);
INSERT INTO public.sockets VALUES (1220, '9nfNfxAULSErv6N1AAAv', '2025-08-18 18:47:16.892405+02', '2025-08-18 18:47:16.892405+02', 1);
INSERT INTO public.sockets VALUES (1221, '1Z3FlJ4BlHPXJ6IQAAAy', '2025-08-18 18:47:16.988937+02', '2025-08-18 18:47:16.988937+02', 6);
INSERT INTO public.sockets VALUES (1223, 'IZYvIPGKoHBa0NcqAAA1', '2025-08-18 18:47:24.87228+02', '2025-08-18 18:47:24.87228+02', 6);
INSERT INTO public.sockets VALUES (1224, 'kdVToNx5yG9Fz7WQAAA3', '2025-08-18 18:47:24.973138+02', '2025-08-18 18:47:24.973138+02', 1);
INSERT INTO public.sockets VALUES (1226, 'BTnmafkcea_webL6AAA8', '2025-08-18 18:47:33.460784+02', '2025-08-18 18:47:33.460784+02', 1);
INSERT INTO public.sockets VALUES (1227, '96FXLFMjhcCktcO6AAA9', '2025-08-18 18:47:33.473966+02', '2025-08-18 18:47:33.473966+02', 6);
INSERT INTO public.sockets VALUES (1229, '0msc1HWuTByCH3DkAABB', '2025-08-18 18:47:39.329542+02', '2025-08-18 18:47:39.329542+02', 4);
INSERT INTO public.sockets VALUES (1230, 'TXrM7owp6cBkhXkmAABD', '2025-08-18 18:47:44.175974+02', '2025-08-18 18:47:44.175974+02', 1);
INSERT INTO public.sockets VALUES (1231, 'sgoAKqECDccUhkEIAABF', '2025-08-18 18:47:44.219462+02', '2025-08-18 18:47:44.219462+02', 6);
INSERT INTO public.sockets VALUES (1232, 'hHYgyMtdqc4UlIiUAABH', '2025-08-18 18:47:44.294308+02', '2025-08-18 18:47:44.294308+02', 4);
INSERT INTO public.sockets VALUES (1233, 'nKiQOiHmDigDPmaRAAAM', '2025-08-18 18:50:15.686036+02', '2025-08-18 18:50:15.686036+02', 1);
INSERT INTO public.sockets VALUES (1234, '_IeUC1lMqFPmly1GAAAN', '2025-08-18 18:50:15.686313+02', '2025-08-18 18:50:15.686313+02', 1);
INSERT INTO public.sockets VALUES (1235, 's5pvs-5Sp1wEFQEXAAAO', '2025-08-18 18:50:15.686641+02', '2025-08-18 18:50:15.686641+02', 1);
INSERT INTO public.sockets VALUES (1236, 'As-7NG4XKSyjRTp4AAAP', '2025-08-18 18:50:15.686906+02', '2025-08-18 18:50:15.686906+02', 6);
INSERT INTO public.sockets VALUES (1237, '7Rzzw9LPssXGexMiAAAQ', '2025-08-18 18:50:15.687555+02', '2025-08-18 18:50:15.687555+02', 1);
INSERT INTO public.sockets VALUES (1238, 'ZQ389vuY_NH3p9GkAAAR', '2025-08-18 18:50:15.688003+02', '2025-08-18 18:50:15.688003+02', 6);
INSERT INTO public.sockets VALUES (1239, 'eNUXfcs3xD58IadWAAAS', '2025-08-18 18:50:15.688371+02', '2025-08-18 18:50:15.688371+02', 1);
INSERT INTO public.sockets VALUES (1240, 'bV0MRmkr19_j-1GlAAAT', '2025-08-18 18:50:15.688785+02', '2025-08-18 18:50:15.688785+02', 6);
INSERT INTO public.sockets VALUES (1241, 'Dyemwy1P9pJR0SQvAAAU', '2025-08-18 18:50:15.68996+02', '2025-08-18 18:50:15.68996+02', 6);
INSERT INTO public.sockets VALUES (1242, 'eypzlwoy__KS6FcMAAAV', '2025-08-18 18:50:15.69061+02', '2025-08-18 18:50:15.69061+02', 6);
INSERT INTO public.sockets VALUES (1243, 'gvuS7uebsKt3hCUrAAAX', '2025-08-18 18:50:15.690307+02', '2025-08-18 18:50:15.690307+02', 4);
INSERT INTO public.sockets VALUES (1244, 'T840SItTMR_o7tv0AAAW', '2025-08-18 18:50:15.690798+02', '2025-08-18 18:50:15.690798+02', 4);
INSERT INTO public.sockets VALUES (1245, '_zbOiJ-qQhV2Mqf2AAAa', '2025-08-18 18:50:16.566044+02', '2025-08-18 18:50:16.566044+02', 1);
INSERT INTO public.sockets VALUES (1246, 'b_OwF9Ym6Vty8cQXAAAb', '2025-08-18 18:50:16.571807+02', '2025-08-18 18:50:16.571807+02', 6);
INSERT INTO public.sockets VALUES (1247, 'dBCOWrJKRvnXGUjxAAAD', '2025-08-18 18:50:17.714871+02', '2025-08-18 18:50:17.714871+02', 6);
INSERT INTO public.sockets VALUES (1248, 'OyeO0YHi689UuAHEAAAE', '2025-08-18 18:50:17.71537+02', '2025-08-18 18:50:17.71537+02', 6);
INSERT INTO public.sockets VALUES (1249, 'rmMVb9MVoUoLMJl3AAAF', '2025-08-18 18:50:17.716125+02', '2025-08-18 18:50:17.716125+02', 6);
INSERT INTO public.sockets VALUES (1250, 'DBNgjf3K8VOT7-a0AAAH', '2025-08-18 18:50:17.71731+02', '2025-08-18 18:50:17.71731+02', 6);
INSERT INTO public.sockets VALUES (1251, '_h-QXb1Xll9C9DZVAAAK', '2025-08-18 18:50:17.833706+02', '2025-08-18 18:50:17.833706+02', 1);
INSERT INTO public.sockets VALUES (1252, '3Cir1AIHK3PVCnYnAAAL', '2025-08-18 18:50:17.837557+02', '2025-08-18 18:50:17.837557+02', 4);
INSERT INTO public.sockets VALUES (1253, 'ZvES27HFR7S6tP1oAAAN', '2025-08-18 18:50:17.942125+02', '2025-08-18 18:50:17.942125+02', 6);
INSERT INTO public.sockets VALUES (1254, 'pAkniztFO-XjfaDtAAAP', '2025-08-18 18:50:18.20906+02', '2025-08-18 18:50:18.20906+02', 6);
INSERT INTO public.sockets VALUES (1255, 'Ma0xWtDAAuy5utwXAAAW', '2025-08-18 18:50:18.569141+02', '2025-08-18 18:50:18.569141+02', 1);
INSERT INTO public.sockets VALUES (1256, 'y3zS-Hlr--jJVYR8AAAX', '2025-08-18 18:50:18.570819+02', '2025-08-18 18:50:18.570819+02', 1);
INSERT INTO public.sockets VALUES (1257, 'nM1bfvh7huhoTwUGAAAY', '2025-08-18 18:50:18.572973+02', '2025-08-18 18:50:18.572973+02', 1);
INSERT INTO public.sockets VALUES (1258, 'LBULvJ1hWAn-oSp-AAAZ', '2025-08-18 18:50:18.578221+02', '2025-08-18 18:50:18.578221+02', 1);
INSERT INTO public.sockets VALUES (1259, 'rZ29M1OdXqvxoFI5AAAa', '2025-08-18 18:50:18.579895+02', '2025-08-18 18:50:18.579895+02', 1);
INSERT INTO public.sockets VALUES (1260, 'yu3uME9W01ZCsAg7AAAb', '2025-08-18 18:50:18.581992+02', '2025-08-18 18:50:18.581992+02', 4);
INSERT INTO public.sockets VALUES (1261, 'uEMhn5-_o4DiXRKOAAAN', '2025-08-18 18:50:34.668352+02', '2025-08-18 18:50:34.668352+02', 1);
INSERT INTO public.sockets VALUES (1262, 'OaOcA6_VupUkFYImAAAO', '2025-08-18 18:50:34.66878+02', '2025-08-18 18:50:34.66878+02', 6);
INSERT INTO public.sockets VALUES (1263, 'E5g6a-4zluYd7RIQAAAP', '2025-08-18 18:50:34.669211+02', '2025-08-18 18:50:34.669211+02', 1);
INSERT INTO public.sockets VALUES (1264, 'hz9IBSRQlGpQ_fVEAAAQ', '2025-08-18 18:50:34.671396+02', '2025-08-18 18:50:34.671396+02', 1);
INSERT INTO public.sockets VALUES (1265, 'zaj62ztnGP38hvXBAAAR', '2025-08-18 18:50:34.671844+02', '2025-08-18 18:50:34.671844+02', 6);
INSERT INTO public.sockets VALUES (1266, '645bvtHdrSrh_PlwAAAS', '2025-08-18 18:50:34.672028+02', '2025-08-18 18:50:34.672028+02', 1);
INSERT INTO public.sockets VALUES (1267, '1qZOokHu_zqbfwvUAAAT', '2025-08-18 18:50:34.672302+02', '2025-08-18 18:50:34.672302+02', 1);
INSERT INTO public.sockets VALUES (1268, '6wQ0SmOSA_YxygA2AAAU', '2025-08-18 18:50:34.672585+02', '2025-08-18 18:50:34.672585+02', 6);
INSERT INTO public.sockets VALUES (1270, 'nszu70Bow14dN3ZNAAAZ', '2025-08-18 18:50:34.673272+02', '2025-08-18 18:50:34.673272+02', 4);
INSERT INTO public.sockets VALUES (1269, 'z3MW1jcC_jzMn9N4AAAY', '2025-08-18 18:50:34.672853+02', '2025-08-18 18:50:34.672853+02', 4);
INSERT INTO public.sockets VALUES (1271, 'zFPgG4D6DYmzfBELAAAW', '2025-08-18 18:50:34.673673+02', '2025-08-18 18:50:34.673673+02', 6);
INSERT INTO public.sockets VALUES (1273, 'vgkMxPK3Qsvl9WP0AAAX', '2025-08-18 18:50:34.673891+02', '2025-08-18 18:50:34.673891+02', 6);
INSERT INTO public.sockets VALUES (1272, 'tDz_Z1uCx0iwKNANAAAV', '2025-08-18 18:50:34.673471+02', '2025-08-18 18:50:34.673471+02', 6);
INSERT INTO public.sockets VALUES (1274, 'npQ3vy9taLNb03NsAAAb', '2025-08-18 18:50:35.575301+02', '2025-08-18 18:50:35.575301+02', 1);
INSERT INTO public.sockets VALUES (1275, '2MHElEv6tccbPYFUAAAL', '2025-08-18 18:50:42.423496+02', '2025-08-18 18:50:42.423496+02', 1);
INSERT INTO public.sockets VALUES (1276, 'LBmB4_igsuL4Cy-3AAAM', '2025-08-18 18:50:42.423837+02', '2025-08-18 18:50:42.423837+02', 1);
INSERT INTO public.sockets VALUES (1277, 'vhvLiXtqTFu14lcqAAAN', '2025-08-18 18:50:42.424074+02', '2025-08-18 18:50:42.424074+02', 6);
INSERT INTO public.sockets VALUES (1278, 'o4S3YqG9nZZZgaLCAAAO', '2025-08-18 18:50:42.42447+02', '2025-08-18 18:50:42.42447+02', 4);
INSERT INTO public.sockets VALUES (1279, 'A1ePNC5SaGeuCgQgAAAQ', '2025-08-18 18:50:42.425085+02', '2025-08-18 18:50:42.425085+02', 4);
INSERT INTO public.sockets VALUES (1280, 'dVxjlQ73CaxtzudJAAAP', '2025-08-18 18:50:42.425399+02', '2025-08-18 18:50:42.425399+02', 1);
INSERT INTO public.sockets VALUES (1281, '0RTjTXR9zzpIRB3ZAAAR', '2025-08-18 18:50:42.425977+02', '2025-08-18 18:50:42.425977+02', 6);
INSERT INTO public.sockets VALUES (1282, 'OEH1aY5fvfR1bp_-AAAS', '2025-08-18 18:50:42.4268+02', '2025-08-18 18:50:42.4268+02', 6);
INSERT INTO public.sockets VALUES (1283, 'GnLNLILf1xPOxaNkAAAV', '2025-08-18 18:50:42.427552+02', '2025-08-18 18:50:42.427552+02', 6);
INSERT INTO public.sockets VALUES (1285, '_dLSKhXAGndh97HMAAAT', '2025-08-18 18:50:42.427782+02', '2025-08-18 18:50:42.427782+02', 1);
INSERT INTO public.sockets VALUES (1284, 'JHYFHM2n4K7jeoIGAAAU', '2025-08-18 18:50:42.427249+02', '2025-08-18 18:50:42.427249+02', 6);
INSERT INTO public.sockets VALUES (1286, 'hZ4i5JZHMdP4bckwAAAZ', '2025-08-18 18:50:42.586666+02', '2025-08-18 18:50:42.586666+02', 1);
INSERT INTO public.sockets VALUES (1287, 'F-bbXcERxK5GznLIAAAa', '2025-08-18 18:50:42.597382+02', '2025-08-18 18:50:42.597382+02', 1);
INSERT INTO public.sockets VALUES (1288, 'h2ZvfPG5LJM4xI09AAAb', '2025-08-18 18:50:42.600988+02', '2025-08-18 18:50:42.600988+02', 6);
INSERT INTO public.sockets VALUES (1314, '82Sj4WixCzdKqtQWAAAz', '2025-08-18 18:56:07.172635+02', '2025-08-18 18:56:07.172635+02', 1);
INSERT INTO public.sockets VALUES (1315, 'CF2hQHb468eIAfxXAAA1', '2025-08-18 18:56:19.040468+02', '2025-08-18 18:56:19.040468+02', 6);
INSERT INTO public.sockets VALUES (1316, 'XJiXgbc353P0vcYNAAA3', '2025-08-18 18:57:53.093134+02', '2025-08-18 18:57:53.093134+02', 1);
INSERT INTO public.sockets VALUES (1317, 'pwiL2vLSxnB1P_EFAAA5', '2025-08-18 18:57:54.409636+02', '2025-08-18 18:57:54.409636+02', 1);
INSERT INTO public.sockets VALUES (1318, 'j3PQd44TZ7t2_t2rAAA7', '2025-08-18 18:57:54.540882+02', '2025-08-18 18:57:54.540882+02', 6);
INSERT INTO public.sockets VALUES (1319, 'WWU5eKd42I2sfcFVAAA-', '2025-08-18 18:57:58.451079+02', '2025-08-18 18:57:58.451079+02', 1);
INSERT INTO public.sockets VALUES (1320, 'zSrJLbxidkZHYCGPAAA_', '2025-08-18 18:57:58.452482+02', '2025-08-18 18:57:58.452482+02', 6);
INSERT INTO public.sockets VALUES (1321, 'WyA-_ep_eRdCrSGgAABB', '2025-08-18 18:58:01.671361+02', '2025-08-18 18:58:01.671361+02', 6);
INSERT INTO public.sockets VALUES (1322, 'pt6aigCfKL5kYOBnAABD', '2025-08-18 18:58:01.733428+02', '2025-08-18 18:58:01.733428+02', 1);
INSERT INTO public.sockets VALUES (1323, 'zEUOCSXj_Cqxg0F3AABF', '2025-08-18 18:58:04.737775+02', '2025-08-18 18:58:04.737775+02', 4);
INSERT INTO public.sockets VALUES (1325, 'XZazca5gKfOzLLhVAAAG', '2025-08-18 19:00:41.581723+02', '2025-08-18 19:00:41.581723+02', 1);
INSERT INTO public.sockets VALUES (1326, 'VMv0AI6leNlCS4n2AAAH', '2025-08-18 19:00:41.587839+02', '2025-08-18 19:00:41.587839+02', 6);
INSERT INTO public.sockets VALUES (1327, 'oK0DGRzoKok0En-YAAAI', '2025-08-18 19:00:41.593434+02', '2025-08-18 19:00:41.593434+02', 1);
INSERT INTO public.sockets VALUES (1328, 'LZjAt1DZMK90COiQAAAJ', '2025-08-18 19:00:41.595578+02', '2025-08-18 19:00:41.595578+02', 6);
INSERT INTO public.sockets VALUES (1329, 'crROEVsxDBhms-XJAAAP', '2025-08-18 19:00:42.562337+02', '2025-08-18 19:00:42.562337+02', 6);
INSERT INTO public.sockets VALUES (1330, 'IggoYdS37wVdPGvSAAAQ', '2025-08-18 19:00:42.56697+02', '2025-08-18 19:00:42.56697+02', 1);
INSERT INTO public.sockets VALUES (1331, 'R72DTkjfXKGDPF0aAAAR', '2025-08-18 19:00:42.567888+02', '2025-08-18 19:00:42.567888+02', 6);
INSERT INTO public.sockets VALUES (1332, 'G61qGnt5w57RAUnpAAAS', '2025-08-18 19:00:42.572445+02', '2025-08-18 19:00:42.572445+02', 1);
INSERT INTO public.sockets VALUES (1333, 'WAI8YuBe1dvbVwioAAAT', '2025-08-18 19:00:42.575681+02', '2025-08-18 19:00:42.575681+02', 1);
INSERT INTO public.sockets VALUES (1334, 'MkwuhtSEMPoaTrJ7AAAV', '2025-08-18 19:00:42.95907+02', '2025-08-18 19:00:42.95907+02', 4);
INSERT INTO public.sockets VALUES (1335, '4vjckkoxvAONNl_2AAAD', '2025-08-18 19:00:51.885286+02', '2025-08-18 19:00:51.885286+02', 6);
INSERT INTO public.sockets VALUES (1336, '79ZMM9uk9XVYKPfyAAAG', '2025-08-18 19:00:51.885709+02', '2025-08-18 19:00:51.885709+02', 1);
INSERT INTO public.sockets VALUES (1337, 'rm928P5hnbFxSI6nAAAF', '2025-08-18 19:00:51.885952+02', '2025-08-18 19:00:51.885952+02', 1);
INSERT INTO public.sockets VALUES (1338, 'r69sF0CMOH6uCQEGAAAH', '2025-08-18 19:00:51.886435+02', '2025-08-18 19:00:51.886435+02', 1);
INSERT INTO public.sockets VALUES (1339, 'jl2kr5i9eBM6NxdQAAAO', '2025-08-18 19:00:52.57935+02', '2025-08-18 19:00:52.57935+02', 6);
INSERT INTO public.sockets VALUES (1340, 'De0oYIIJHasLfwuFAAAP', '2025-08-18 19:00:52.581651+02', '2025-08-18 19:00:52.581651+02', 1);
INSERT INTO public.sockets VALUES (1341, 'jsqflcrGc5iP3uPkAAAQ', '2025-08-18 19:00:52.590547+02', '2025-08-18 19:00:52.590547+02', 6);
INSERT INTO public.sockets VALUES (1342, 'z18I6myQ4VnF4P26AAAR', '2025-08-18 19:00:52.594019+02', '2025-08-18 19:00:52.594019+02', 1);
INSERT INTO public.sockets VALUES (1343, 'qVbXLC63fQc-OU5sAAAS', '2025-08-18 19:00:52.594411+02', '2025-08-18 19:00:52.594411+02', 6);
INSERT INTO public.sockets VALUES (1344, 'jxazvIlPyq0NzoqGAAAT', '2025-08-18 19:00:52.597294+02', '2025-08-18 19:00:52.597294+02', 4);
INSERT INTO public.sockets VALUES (1345, 'IsxxGRouzzmgh2yZAAAH', '2025-08-18 19:01:27.654878+02', '2025-08-18 19:01:27.654878+02', 6);
INSERT INTO public.sockets VALUES (1346, 'H8j2NhtZaf_0uOiwAAAJ', '2025-08-18 19:01:27.655694+02', '2025-08-18 19:01:27.655694+02', 6);
INSERT INTO public.sockets VALUES (1347, 'O5sGo-FlsRrVqu_CAAAI', '2025-08-18 19:01:27.656286+02', '2025-08-18 19:01:27.656286+02', 1);
INSERT INTO public.sockets VALUES (1348, 'ZH1xTmux6BnnxTnaAAAL', '2025-08-18 19:01:27.656605+02', '2025-08-18 19:01:27.656605+02', 1);
INSERT INTO public.sockets VALUES (1351, 'Plfr9UBcdnuBvVUgAAAN', '2025-08-18 19:01:27.657642+02', '2025-08-18 19:01:27.657642+02', 1);
INSERT INTO public.sockets VALUES (1349, 'fa0MJe5yRenfgCvqAAAM', '2025-08-18 19:01:27.656879+02', '2025-08-18 19:01:27.656879+02', 4);
INSERT INTO public.sockets VALUES (1350, 'KwCh02fvRpDylv3NAAAK', '2025-08-18 19:01:27.657204+02', '2025-08-18 19:01:27.657204+02', 6);
INSERT INTO public.sockets VALUES (1352, 'CWCbGoS_mStmho1CAAAE', '2025-08-18 19:01:28.85105+02', '2025-08-18 19:01:28.85105+02', 1);
INSERT INTO public.sockets VALUES (1353, 'ORzthroEdCjXKqZ1AAAF', '2025-08-18 19:01:28.851402+02', '2025-08-18 19:01:28.851402+02', 1);
INSERT INTO public.sockets VALUES (1354, 'HoLqnvv_CialfcvTAAAK', '2025-08-18 19:01:28.851846+02', '2025-08-18 19:01:28.851846+02', 6);
INSERT INTO public.sockets VALUES (1356, '7bvXqWZ0mHQG6fN9AAAH', '2025-08-18 19:01:28.852862+02', '2025-08-18 19:01:28.852862+02', 1);
INSERT INTO public.sockets VALUES (1355, 'qWU4R2kXk3DNmkNXAAAG', '2025-08-18 19:01:28.852377+02', '2025-08-18 19:01:28.852377+02', 1);
INSERT INTO public.sockets VALUES (1357, 'SdvrdxYM1TktcD0gAAAL', '2025-08-18 19:01:28.853327+02', '2025-08-18 19:01:28.853327+02', 6);
INSERT INTO public.sockets VALUES (1358, 'Ima7_P8pQseq6tRgAAAP', '2025-08-18 19:01:29.578426+02', '2025-08-18 19:01:29.578426+02', 6);
INSERT INTO public.sockets VALUES (1359, '2vbw8LjCltoC1fnBAAAQ', '2025-08-18 19:01:29.581458+02', '2025-08-18 19:01:29.581458+02', 4);
INSERT INTO public.sockets VALUES (1360, 'KkHTTp89jg5DXXs-AAAR', '2025-08-18 19:01:29.582847+02', '2025-08-18 19:01:29.582847+02', 6);
INSERT INTO public.sockets VALUES (1361, 'cVdY2k0ZtDZ6FAi6AAAT', '2025-08-18 19:01:30.578819+02', '2025-08-18 19:01:30.578819+02', 1);
INSERT INTO public.sockets VALUES (1362, 'AjG-w2cZ2F9gOvqFAAAJ', '2025-08-18 19:01:37.649965+02', '2025-08-18 19:01:37.649965+02', 1);
INSERT INTO public.sockets VALUES (1363, 'pLl7M6t2SmL7GSSMAAAK', '2025-08-18 19:01:37.650373+02', '2025-08-18 19:01:37.650373+02', 6);
INSERT INTO public.sockets VALUES (1364, 'yI3v-vGFcraqzoX-AAAL', '2025-08-18 19:01:37.650503+02', '2025-08-18 19:01:37.650503+02', 1);
INSERT INTO public.sockets VALUES (1365, '_7eKgREHHjsAw4RpAAAO', '2025-08-18 19:01:37.650908+02', '2025-08-18 19:01:37.650908+02', 4);
INSERT INTO public.sockets VALUES (1367, 'gvP1ZVs5p-5egYjyAAAM', '2025-08-18 19:01:37.651761+02', '2025-08-18 19:01:37.651761+02', 1);
INSERT INTO public.sockets VALUES (1366, '4HQgz-ixGq4vqe8TAAAP', '2025-08-18 19:01:37.651179+02', '2025-08-18 19:01:37.651179+02', 6);
INSERT INTO public.sockets VALUES (1368, 'k2aZOBHCzYRtaa22AAAQ', '2025-08-18 19:01:37.652175+02', '2025-08-18 19:01:37.652175+02', 6);
INSERT INTO public.sockets VALUES (1370, '5zUnlv1nUkLxvcmNAAAR', '2025-08-18 19:01:37.652693+02', '2025-08-18 19:01:37.652693+02', 1);
INSERT INTO public.sockets VALUES (1369, '3OyNKzyKReVWiheCAAAN', '2025-08-18 19:01:37.652355+02', '2025-08-18 19:01:37.652355+02', 6);
INSERT INTO public.sockets VALUES (1371, 'DCai0EGfn87mQ0ITAAAB', '2025-08-18 19:01:39.131333+02', '2025-08-18 19:01:39.131333+02', 1);
INSERT INTO public.sockets VALUES (1372, 'DzkX-vEDvvDqTmxlAAAK', '2025-08-18 19:01:39.611756+02', '2025-08-18 19:01:39.611756+02', 1);
INSERT INTO public.sockets VALUES (1373, 'nGJUw3flHMu80N6oAAAL', '2025-08-18 19:01:39.621696+02', '2025-08-18 19:01:39.621696+02', 6);
INSERT INTO public.sockets VALUES (1374, '4RbcrBLMYHRWk63lAAAM', '2025-08-18 19:01:39.622691+02', '2025-08-18 19:01:39.622691+02', 1);
INSERT INTO public.sockets VALUES (1375, '65mwATPI52HKyzCWAAAN', '2025-08-18 19:01:39.624993+02', '2025-08-18 19:01:39.624993+02', 1);
INSERT INTO public.sockets VALUES (1376, 'zlE9hFcPxTkoqacbAAAO', '2025-08-18 19:01:39.626655+02', '2025-08-18 19:01:39.626655+02', 6);
INSERT INTO public.sockets VALUES (1377, 'WZFS9elVyiIYux1dAAAP', '2025-08-18 19:01:39.627578+02', '2025-08-18 19:01:39.627578+02', 6);
INSERT INTO public.sockets VALUES (1379, '4X5anQgkB_uisxS2AAAR', '2025-08-18 19:01:39.629478+02', '2025-08-18 19:01:39.629478+02', 6);
INSERT INTO public.sockets VALUES (1378, 'PhyTZNtsQbig6M_kAAAQ', '2025-08-18 19:01:39.628841+02', '2025-08-18 19:01:39.628841+02', 4);
INSERT INTO public.sockets VALUES (1380, 'xOMlsgQMEBUmJgplAAAT', '2025-08-18 19:01:40.567618+02', '2025-08-18 19:01:40.567618+02', 1);
INSERT INTO public.sockets VALUES (1381, '7kJzfFbySMu9-lrdAAAJ', '2025-08-18 19:01:42.647155+02', '2025-08-18 19:01:42.647155+02', 1);
INSERT INTO public.sockets VALUES (1382, 'kCjYCnySD22qNsh_AAAK', '2025-08-18 19:01:42.647558+02', '2025-08-18 19:01:42.647558+02', 6);
INSERT INTO public.sockets VALUES (1383, 'AFZe5GyK42oVOYU-AAAL', '2025-08-18 19:01:42.648214+02', '2025-08-18 19:01:42.648214+02', 1);
INSERT INTO public.sockets VALUES (1384, '2Jmqo55KLXQgEADWAAAM', '2025-08-18 19:01:42.648682+02', '2025-08-18 19:01:42.648682+02', 6);
INSERT INTO public.sockets VALUES (1385, 'P53Kkly0N64L5582AAAR', '2025-08-18 19:01:42.649186+02', '2025-08-18 19:01:42.649186+02', 6);
INSERT INTO public.sockets VALUES (1386, 'F1ZKf5TqudcOC68UAAAN', '2025-08-18 19:01:42.650149+02', '2025-08-18 19:01:42.650149+02', 1);
INSERT INTO public.sockets VALUES (1388, 'EMPOm_ruhkh9JK-dAAAQ', '2025-08-18 19:01:42.65153+02', '2025-08-18 19:01:42.65153+02', 1);
INSERT INTO public.sockets VALUES (1387, 'ek5yOEbHBeoj2ezyAAAP', '2025-08-18 19:01:42.650572+02', '2025-08-18 19:01:42.650572+02', 6);
INSERT INTO public.sockets VALUES (1389, 'Qe0bBlRAf4cEgO4kAAAO', '2025-08-18 19:01:42.65205+02', '2025-08-18 19:01:42.65205+02', 4);
INSERT INTO public.sockets VALUES (1390, 'qJBeZOxUrKmh9onBAAAT', '2025-08-18 19:01:43.561364+02', '2025-08-18 19:01:43.561364+02', 1);
INSERT INTO public.sockets VALUES (1391, 'oa0CzWhxA3czkfyxAAAJ', '2025-08-18 19:01:45.63921+02', '2025-08-18 19:01:45.63921+02', 6);
INSERT INTO public.sockets VALUES (1393, 'GdOvjV6XYv8pg2LCAAAM', '2025-08-18 19:01:45.639768+02', '2025-08-18 19:01:45.639768+02', 6);
INSERT INTO public.sockets VALUES (1392, 'e8YFL2WNBxLxb-b-AAAL', '2025-08-18 19:01:45.639477+02', '2025-08-18 19:01:45.639477+02', 6);
INSERT INTO public.sockets VALUES (1394, 'gIesMWshulyVdjRCAAAN', '2025-08-18 19:01:45.640384+02', '2025-08-18 19:01:45.640384+02', 1);
INSERT INTO public.sockets VALUES (1395, 'ZHpoJ87zWw__2vVgAAAP', '2025-08-18 19:01:45.640923+02', '2025-08-18 19:01:45.640923+02', 1);
INSERT INTO public.sockets VALUES (1396, 'wHad3YdZOSS7aQu1AAAO', '2025-08-18 19:01:45.641125+02', '2025-08-18 19:01:45.641125+02', 1);
INSERT INTO public.sockets VALUES (1397, 'fnMRPogEH0mTXHIQAAAQ', '2025-08-18 19:01:45.641968+02', '2025-08-18 19:01:45.641968+02', 1);
INSERT INTO public.sockets VALUES (1398, 'rrCzhGltp9UphYZ7AAAR', '2025-08-18 19:01:45.642353+02', '2025-08-18 19:01:45.642353+02', 4);
INSERT INTO public.sockets VALUES (1399, 'M4pKgQUw4M0M2Eb7AAAS', '2025-08-18 19:01:45.642597+02', '2025-08-18 19:01:45.642597+02', 6);
INSERT INTO public.sockets VALUES (1400, 'HUOGoQv2XZkorXgeAAAT', '2025-08-18 19:01:45.642934+02', '2025-08-18 19:01:45.642934+02', 1);
INSERT INTO public.sockets VALUES (1401, 'Bl98FaEpSgNEPdg8AAAE', '2025-08-18 19:01:50.627514+02', '2025-08-18 19:01:50.627514+02', 6);
INSERT INTO public.sockets VALUES (1402, 'S7zHpSN7pPooikgCAAAG', '2025-08-18 19:01:50.627866+02', '2025-08-18 19:01:50.627866+02', 1);
INSERT INTO public.sockets VALUES (1403, 'iIwCYmtoNZ10J-xtAAAH', '2025-08-18 19:01:50.628309+02', '2025-08-18 19:01:50.628309+02', 4);
INSERT INTO public.sockets VALUES (1404, 'qowlq0khff79qImHAAAI', '2025-08-18 19:01:50.62893+02', '2025-08-18 19:01:50.62893+02', 1);
INSERT INTO public.sockets VALUES (1405, 'PWvo7J7rvaY7GZyYAAAJ', '2025-08-18 19:01:50.630093+02', '2025-08-18 19:01:50.630093+02', 1);
INSERT INTO public.sockets VALUES (1406, 'm9lMj-WJ1bFSwjYbAAAP', '2025-08-18 19:01:51.567161+02', '2025-08-18 19:01:51.567161+02', 6);
INSERT INTO public.sockets VALUES (1407, 'Cace9N9ZitqJXFwnAAAQ', '2025-08-18 19:01:51.572028+02', '2025-08-18 19:01:51.572028+02', 1);
INSERT INTO public.sockets VALUES (1408, 'U9zsPiRqoObXS-EAAAAR', '2025-08-18 19:01:51.574754+02', '2025-08-18 19:01:51.574754+02', 6);
INSERT INTO public.sockets VALUES (1409, 'nXZijSQiuTuVMsp0AAAS', '2025-08-18 19:01:51.575232+02', '2025-08-18 19:01:51.575232+02', 1);
INSERT INTO public.sockets VALUES (1410, 'MBv7V45SbGAaWArDAAAT', '2025-08-18 19:01:51.576027+02', '2025-08-18 19:01:51.576027+02', 6);
INSERT INTO public.sockets VALUES (1411, 'zGH1PVYp0QYG4W0RAAAK', '2025-08-18 19:01:54.641191+02', '2025-08-18 19:01:54.641191+02', 1);
INSERT INTO public.sockets VALUES (1412, 'I-p3l-iPMlnZvKnRAAAL', '2025-08-18 19:01:54.641685+02', '2025-08-18 19:01:54.641685+02', 6);
INSERT INTO public.sockets VALUES (1413, '699JBSJDfYEX26zPAAAM', '2025-08-18 19:01:54.642154+02', '2025-08-18 19:01:54.642154+02', 6);
INSERT INTO public.sockets VALUES (1414, 'sxYooKwTWeEgUqLyAAAQ', '2025-08-18 19:01:54.642692+02', '2025-08-18 19:01:54.642692+02', 6);
INSERT INTO public.sockets VALUES (1416, '7TnOH2ARRm4pfGN5AAAN', '2025-08-18 19:01:54.643188+02', '2025-08-18 19:01:54.643188+02', 1);
INSERT INTO public.sockets VALUES (1415, 'gtO2gW_pn3T_tNAyAAAR', '2025-08-18 19:01:54.642914+02', '2025-08-18 19:01:54.642914+02', 6);
INSERT INTO public.sockets VALUES (1419, 'KOmokumA9X-Ixv40AAAP', '2025-08-18 19:01:54.645517+02', '2025-08-18 19:01:54.645517+02', 4);
INSERT INTO public.sockets VALUES (1417, '87S95UrOnfb-yNv-AAAS', '2025-08-18 19:01:54.644767+02', '2025-08-18 19:01:54.644767+02', 1);
INSERT INTO public.sockets VALUES (1418, '431opxdr1RRubGtGAAAO', '2025-08-18 19:01:54.645011+02', '2025-08-18 19:01:54.645011+02', 1);
INSERT INTO public.sockets VALUES (1420, 'jJ626udGaqMttpgRAAAT', '2025-08-18 19:01:54.645768+02', '2025-08-18 19:01:54.645768+02', 1);
INSERT INTO public.sockets VALUES (1421, 'Zt2axRGZvKl74S4MAAAI', '2025-08-18 19:02:07.40148+02', '2025-08-18 19:02:07.40148+02', 6);
INSERT INTO public.sockets VALUES (1422, 'NwFwstfaWJrh0c_eAAAJ', '2025-08-18 19:02:07.402036+02', '2025-08-18 19:02:07.402036+02', 6);
INSERT INTO public.sockets VALUES (1423, 'HUpEZQ30_MvSZkjhAAAK', '2025-08-18 19:02:07.402525+02', '2025-08-18 19:02:07.402525+02', 1);
INSERT INTO public.sockets VALUES (1424, 'eBMhPEF6LyRC_AUUAAAL', '2025-08-18 19:02:07.402886+02', '2025-08-18 19:02:07.402886+02', 4);
INSERT INTO public.sockets VALUES (1425, 'YnTwzT6EBwniLOCtAAAP', '2025-08-18 19:02:07.403239+02', '2025-08-18 19:02:07.403239+02', 1);
INSERT INTO public.sockets VALUES (1426, '5UbZ1mYH49wFvMNpAAAM', '2025-08-18 19:02:07.403617+02', '2025-08-18 19:02:07.403617+02', 1);
INSERT INTO public.sockets VALUES (1427, 'PcsRc4A9lQKfFwX3AAAN', '2025-08-18 19:02:07.404761+02', '2025-08-18 19:02:07.404761+02', 6);
INSERT INTO public.sockets VALUES (1428, 'pT9q4ZyNl17mqXBlAAAO', '2025-08-18 19:02:07.40502+02', '2025-08-18 19:02:07.40502+02', 1);
INSERT INTO public.sockets VALUES (1429, 'SMJRW4A9_giIAeR_AAAS', '2025-08-18 19:02:07.567279+02', '2025-08-18 19:02:07.567279+02', 1);
INSERT INTO public.sockets VALUES (1430, 'MR8yyqVczdhAbueFAAAT', '2025-08-18 19:02:07.568+02', '2025-08-18 19:02:07.568+02', 6);
INSERT INTO public.sockets VALUES (1431, 'aCPoRKjail4lPYQkAAAJ', '2025-08-18 19:02:11.64189+02', '2025-08-18 19:02:11.64189+02', 1);
INSERT INTO public.sockets VALUES (1432, '6hH_SKkqEs1OywkzAAAK', '2025-08-18 19:02:11.642301+02', '2025-08-18 19:02:11.642301+02', 6);
INSERT INTO public.sockets VALUES (1433, 'kwXFsB24QyfgwiR9AAAL', '2025-08-18 19:02:11.642534+02', '2025-08-18 19:02:11.642534+02', 1);
INSERT INTO public.sockets VALUES (1434, 'fhIEUnehZ_xREOohAAAM', '2025-08-18 19:02:11.643112+02', '2025-08-18 19:02:11.643112+02', 6);
INSERT INTO public.sockets VALUES (1435, 'lm_Z5Qc6f1BSzJxeAAAN', '2025-08-18 19:02:11.643472+02', '2025-08-18 19:02:11.643472+02', 1);
INSERT INTO public.sockets VALUES (1436, 'KSwk09OouUaOdgrRAAAP', '2025-08-18 19:02:11.643976+02', '2025-08-18 19:02:11.643976+02', 6);
INSERT INTO public.sockets VALUES (1438, 'g8r9liRRquDOn_SrAAAQ', '2025-08-18 19:02:11.647431+02', '2025-08-18 19:02:11.647431+02', 6);
INSERT INTO public.sockets VALUES (1439, 'KzJk6ueiurjtAI5lAAAR', '2025-08-18 19:02:11.648289+02', '2025-08-18 19:02:11.648289+02', 1);
INSERT INTO public.sockets VALUES (1440, 'd17YOotWY2MinbmQAAAT', '2025-08-18 19:02:12.566929+02', '2025-08-18 19:02:12.566929+02', 1);
INSERT INTO public.sockets VALUES (1441, 'ywAEqU5b4NG-Q90DAAAV', '2025-08-18 19:02:13.228435+02', '2025-08-18 19:02:13.228435+02', 4);
INSERT INTO public.sockets VALUES (1442, 'kEn91AY25krFMqmoAAAI', '2025-08-18 19:02:22.657474+02', '2025-08-18 19:02:22.657474+02', 1);
INSERT INTO public.sockets VALUES (1443, 'xnFZzEVUQomB_SxTAAAJ', '2025-08-18 19:02:22.658278+02', '2025-08-18 19:02:22.658278+02', 1);
INSERT INTO public.sockets VALUES (1444, 'noo_-CqoU_ml52nDAAAK', '2025-08-18 19:02:22.658784+02', '2025-08-18 19:02:22.658784+02', 6);
INSERT INTO public.sockets VALUES (1445, '5xgyGLeWuAkFTriWAAAN', '2025-08-18 19:02:22.659282+02', '2025-08-18 19:02:22.659282+02', 1);
INSERT INTO public.sockets VALUES (1446, 'JppM5zYZy2PBEo52AAAP', '2025-08-18 19:02:22.659968+02', '2025-08-18 19:02:22.659968+02', 6);
INSERT INTO public.sockets VALUES (1447, 'SVPmWcKviJSjSri-AAAL', '2025-08-18 19:02:22.659604+02', '2025-08-18 19:02:22.659604+02', 1);
INSERT INTO public.sockets VALUES (1448, 'yWuqlmvHqL3xYUilAAAM', '2025-08-18 19:02:22.6617+02', '2025-08-18 19:02:22.6617+02', 6);
INSERT INTO public.sockets VALUES (1449, '-2joXYCM2Mova8qAAAAO', '2025-08-18 19:02:22.662133+02', '2025-08-18 19:02:22.662133+02', 6);
INSERT INTO public.sockets VALUES (1450, 'cYwtYcsjWL5Gift3AAAR', '2025-08-18 19:02:23.5901+02', '2025-08-18 19:02:23.5901+02', 1);
INSERT INTO public.sockets VALUES (1451, '7aXeKilzdfVutma0AAAT', '2025-08-18 19:02:51.011966+02', '2025-08-18 19:02:51.011966+02', 4);
INSERT INTO public.sockets VALUES (1454, 'EHS7SLlUp5owMcrrAAAL', '2025-08-18 19:03:17.586549+02', '2025-08-18 19:03:17.586549+02', 6);
INSERT INTO public.sockets VALUES (1453, 'nFZ5Eq9SbTjiXoWEAAAK', '2025-08-18 19:03:17.585899+02', '2025-08-18 19:03:17.585899+02', 1);
INSERT INTO public.sockets VALUES (1455, 'mD4dl7zCXKoZICVbAAAM', '2025-08-18 19:03:17.59277+02', '2025-08-18 19:03:17.59277+02', 1);
INSERT INTO public.sockets VALUES (1456, 'Y8JX3fK0VVK1ThzZAAAN', '2025-08-18 19:03:17.595854+02', '2025-08-18 19:03:17.595854+02', 1);
INSERT INTO public.sockets VALUES (1457, 'qhfCdznT93HlxL9UAAAO', '2025-08-18 19:03:17.600898+02', '2025-08-18 19:03:17.600898+02', 1);
INSERT INTO public.sockets VALUES (1458, 'qH45XhXe7JMIyUr-AAAP', '2025-08-18 19:03:17.606779+02', '2025-08-18 19:03:17.606779+02', 6);
INSERT INTO public.sockets VALUES (1459, 'ZlPK0q09VjHAvzXzAAAQ', '2025-08-18 19:03:17.617963+02', '2025-08-18 19:03:17.617963+02', 6);
INSERT INTO public.sockets VALUES (1460, '0sz2E2aJUugfFoiLAAAR', '2025-08-18 19:03:17.618849+02', '2025-08-18 19:03:17.618849+02', 1);
INSERT INTO public.sockets VALUES (1461, 'Hfm5JBvXhsCE2KDiAAAT', '2025-08-18 19:03:18.174426+02', '2025-08-18 19:03:18.174426+02', 4);
INSERT INTO public.sockets VALUES (1462, '-YKQDF-hDFpB7oIJAAAV', '2025-08-18 19:03:18.580211+02', '2025-08-18 19:03:18.580211+02', 6);
INSERT INTO public.sockets VALUES (1463, 'mL9tLRjiU7AMjT16AAAK', '2025-08-18 19:03:25.663552+02', '2025-08-18 19:03:25.663552+02', 1);
INSERT INTO public.sockets VALUES (1464, 'EqQggqqALbAmJw5tAAAL', '2025-08-18 19:03:25.663952+02', '2025-08-18 19:03:25.663952+02', 6);
INSERT INTO public.sockets VALUES (1465, '8dq6m7Yq7GUtjPVGAAAM', '2025-08-18 19:03:25.664317+02', '2025-08-18 19:03:25.664317+02', 1);
INSERT INTO public.sockets VALUES (1466, '9h0hbRQTQ9jK-P5GAAAQ', '2025-08-18 19:03:25.665183+02', '2025-08-18 19:03:25.665183+02', 4);
INSERT INTO public.sockets VALUES (1467, 'veraKnB2bQx4NPjzAAAN', '2025-08-18 19:03:25.665954+02', '2025-08-18 19:03:25.665954+02', 6);
INSERT INTO public.sockets VALUES (1469, 'vUG-pDsaJQr8Y9-7AAAR', '2025-08-18 19:03:25.669096+02', '2025-08-18 19:03:25.669096+02', 1);
INSERT INTO public.sockets VALUES (1468, 'oU1YewHleWUZMqAKAAAS', '2025-08-18 19:03:25.668411+02', '2025-08-18 19:03:25.668411+02', 6);
INSERT INTO public.sockets VALUES (1470, 'wWMrPjh6Qhr485z8AAAO', '2025-08-18 19:03:25.669666+02', '2025-08-18 19:03:25.669666+02', 6);
INSERT INTO public.sockets VALUES (1471, 'U_c1CqmFddqLMbiwAAAP', '2025-08-18 19:03:25.670043+02', '2025-08-18 19:03:25.670043+02', 1);
INSERT INTO public.sockets VALUES (1472, 'nffYbzx83mID4MG6AAAT', '2025-08-18 19:03:25.67032+02', '2025-08-18 19:03:25.67032+02', 1);
INSERT INTO public.sockets VALUES (1473, 'sRVEMeVT7UbRbxujAAAC', '2025-08-18 19:03:27.878253+02', '2025-08-18 19:03:27.878253+02', 1);
INSERT INTO public.sockets VALUES (1474, 'AZ-sHY8-UttZOsxeAAAD', '2025-08-18 19:03:27.878687+02', '2025-08-18 19:03:27.878687+02', 6);
INSERT INTO public.sockets VALUES (1475, 'pL4tER6_1NhNm_rmAAAM', '2025-08-18 19:03:28.571874+02', '2025-08-18 19:03:28.571874+02', 1);
INSERT INTO public.sockets VALUES (1476, 'MO-DAbhvcBw9ZCR9AAAN', '2025-08-18 19:03:28.584407+02', '2025-08-18 19:03:28.584407+02', 6);
INSERT INTO public.sockets VALUES (1477, 'xdkT8ey8e6JIhprLAAAO', '2025-08-18 19:03:28.596248+02', '2025-08-18 19:03:28.596248+02', 1);
INSERT INTO public.sockets VALUES (1478, '9X6fIbxivQsYFbZ8AAAP', '2025-08-18 19:03:28.598582+02', '2025-08-18 19:03:28.598582+02', 6);
INSERT INTO public.sockets VALUES (1479, 'TYohop2JhOCmAfH6AAAQ', '2025-08-18 19:03:28.600159+02', '2025-08-18 19:03:28.600159+02', 1);
INSERT INTO public.sockets VALUES (1480, 'x6LVSQdRh1YjPDiNAAAR', '2025-08-18 19:03:28.600657+02', '2025-08-18 19:03:28.600657+02', 6);
INSERT INTO public.sockets VALUES (1481, 'MvfKuq2Eu9CyPd_QAAAS', '2025-08-18 19:03:28.602321+02', '2025-08-18 19:03:28.602321+02', 4);
INSERT INTO public.sockets VALUES (1482, 'ZGvbTbVuAgvKZDgcAAAT', '2025-08-18 19:03:28.602679+02', '2025-08-18 19:03:28.602679+02', 1);
INSERT INTO public.sockets VALUES (1483, 'dszK3mymc4_rvR0sAAAK', '2025-08-18 19:03:30.66775+02', '2025-08-18 19:03:30.66775+02', 1);
INSERT INTO public.sockets VALUES (1484, 'AIwKJ3FLr9iB76uyAAAL', '2025-08-18 19:03:30.668106+02', '2025-08-18 19:03:30.668106+02', 6);
INSERT INTO public.sockets VALUES (1485, 'CZSmfYRQMOmBJ0WOAAAM', '2025-08-18 19:03:30.668383+02', '2025-08-18 19:03:30.668383+02', 1);
INSERT INTO public.sockets VALUES (1486, 'i5MIz2CUBVzWoOcPAAAN', '2025-08-18 19:03:30.668645+02', '2025-08-18 19:03:30.668645+02', 1);
INSERT INTO public.sockets VALUES (1487, 'E10E5RplVfe6XkGBAAAQ', '2025-08-18 19:03:30.669198+02', '2025-08-18 19:03:30.669198+02', 6);
INSERT INTO public.sockets VALUES (1488, '9nLGdb4gRPQdngC1AAAR', '2025-08-18 19:03:30.669592+02', '2025-08-18 19:03:30.669592+02', 1);
INSERT INTO public.sockets VALUES (1489, 'r_2nhz5GcWON7yIfAAAS', '2025-08-18 19:03:30.669835+02', '2025-08-18 19:03:30.669835+02', 4);
INSERT INTO public.sockets VALUES (1490, 'lxIQVGeyltkYX89kAAAO', '2025-08-18 19:03:30.671883+02', '2025-08-18 19:03:30.671883+02', 6);
INSERT INTO public.sockets VALUES (1491, 'HHq-YzBSWzEAUWm-AAAP', '2025-08-18 19:03:30.672233+02', '2025-08-18 19:03:30.672233+02', 1);
INSERT INTO public.sockets VALUES (1492, 'PmYuL0Zg3mnrXjh1AAAT', '2025-08-18 19:03:30.672578+02', '2025-08-18 19:03:30.672578+02', 6);
INSERT INTO public.sockets VALUES (1493, 'WecAXLkfxxUaKQa1AAAC', '2025-08-18 19:03:32.875054+02', '2025-08-18 19:03:32.875054+02', 6);
INSERT INTO public.sockets VALUES (1494, '87BrM7eytJELUyh2AAAD', '2025-08-18 19:03:32.875451+02', '2025-08-18 19:03:32.875451+02', 1);
INSERT INTO public.sockets VALUES (1495, 'EGE1ILU1XB-4SXNgAAAL', '2025-08-18 19:03:33.566469+02', '2025-08-18 19:03:33.566469+02', 1);
INSERT INTO public.sockets VALUES (1496, 'KLUCLyYCxq8JNCidAAAM', '2025-08-18 19:03:33.580587+02', '2025-08-18 19:03:33.580587+02', 6);
INSERT INTO public.sockets VALUES (1497, 'EObdmCjwuIVYjsalAAAN', '2025-08-18 19:03:33.588549+02', '2025-08-18 19:03:33.588549+02', 1);
INSERT INTO public.sockets VALUES (1498, 'mbutybOgh9HrNjqnAAAO', '2025-08-18 19:03:33.588904+02', '2025-08-18 19:03:33.588904+02', 6);
INSERT INTO public.sockets VALUES (1499, 'SXhJ0KvNmdV14N1zAAAP', '2025-08-18 19:03:33.590137+02', '2025-08-18 19:03:33.590137+02', 1);
INSERT INTO public.sockets VALUES (1500, '4lzTyJBLx_I269iEAAAQ', '2025-08-18 19:03:33.590917+02', '2025-08-18 19:03:33.590917+02', 6);
INSERT INTO public.sockets VALUES (1501, 'gNE9OO_dr3VgvmX3AAAR', '2025-08-18 19:03:33.591484+02', '2025-08-18 19:03:33.591484+02', 1);
INSERT INTO public.sockets VALUES (1502, 'xPPnK3fZ6A3PgA5rAAAT', '2025-08-18 19:03:33.794516+02', '2025-08-18 19:03:33.794516+02', 4);
INSERT INTO public.sockets VALUES (1558, 'b_ZELaiJtpa7tz20AABv', '2025-08-18 19:17:15.207069+02', '2025-08-18 19:17:15.207069+02', 1);


--
-- TOC entry 5189 (class 0 OID 962144)
-- Dependencies: 238
-- Data for Name: system; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.system VALUES (1, 'owner_base_commission_percent', '15');
INSERT INTO public.system VALUES (2, 'owner_boost_commission_percent', '20');
INSERT INTO public.system VALUES (3, 'renter_base_commission_percent', '15');
INSERT INTO public.system VALUES (4, 'user_log_active', 'true');
INSERT INTO public.system VALUES (5, 'api_key', 'SPWNFPCPTT1BKRQG30VAE8QE4LNENEVC');
INSERT INTO public.system VALUES (6, 'correlation_threshold', '0.9');
INSERT INTO public.system VALUES (7, 'p_value_threshold', '0.9');
INSERT INTO public.system VALUES (8, 'n_estimators', '100');
INSERT INTO public.system VALUES (9, 'random_state', '41');
INSERT INTO public.system VALUES (10, 'train_test_split', '70');


--
-- TOC entry 5233 (class 0 OID 989310)
-- Dependencies: 282
-- Data for Name: temp_orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.temp_orders VALUES (3, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:11:51.006118+02', '2025-08-10 12:11:51.006118+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (4, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:12:20.904765+02', '2025-08-10 12:12:20.904765+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (5, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:13:08.820355+02', '2025-08-10 12:13:08.820355+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (6, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:16:45.961056+02', '2025-08-10 12:16:45.961056+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (7, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:18:18.052567+02', '2025-08-10 12:18:18.052567+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (8, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:19:28.232908+02', '2025-08-10 12:19:28.232908+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (9, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:23:52.307158+02', '2025-08-10 12:23:52.307158+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (10, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:28:57.239255+02', '2025-08-10 12:28:57.239255+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (11, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:30:56.972007+02', '2025-08-10 12:30:56.972007+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (12, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:31:52.913418+02', '2025-08-10 12:31:52.913418+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (13, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:37:32.080713+02', '2025-08-10 12:37:32.080713+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (14, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:38:10.820009+02', '2025-08-10 12:38:10.820009+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (15, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:39:01.481705+02', '2025-08-10 12:39:01.481705+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (16, 'pending_owner', NULL, 10, '2025-08-09 23:00:00+02', '2025-08-13 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:39:27.214744+02', '2025-08-10 12:39:27.214744+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (17, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 13:16:18.055326+02', '2025-08-10 13:16:18.055326+02', 2, 1, NULL);
INSERT INTO public.temp_orders VALUES (18, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 17:21:50.926381+02', '2025-08-18 17:21:50.926381+02', 4, 24, NULL);
INSERT INTO public.temp_orders VALUES (19, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 17:24:17.864491+02', '2025-08-18 17:24:17.864491+02', 4, 24, NULL);
INSERT INTO public.temp_orders VALUES (20, 'pending_owner', NULL, 5.74, '2025-08-17 23:00:00+02', '2025-08-22 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 17:28:59.819916+02', '2025-08-18 17:28:59.819916+02', 4, 24, NULL);
INSERT INTO public.temp_orders VALUES (21, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:25:38.493523+02', '2025-08-18 18:25:38.493523+02', 4, 48, NULL);
INSERT INTO public.temp_orders VALUES (22, 'pending_owner', NULL, 5, '2025-08-17 23:00:00+02', '2025-08-22 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:27:01.711547+02', '2025-08-18 18:27:01.711547+02', 4, 48, NULL);
INSERT INTO public.temp_orders VALUES (23, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:35:34.172554+02', '2025-08-18 18:35:34.172554+02', 4, 48, NULL);
INSERT INTO public.temp_orders VALUES (24, 'pending_owner', NULL, 5, '2025-08-23 23:00:00+02', '2025-08-24 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:36:19.054663+02', '2025-08-18 18:36:19.054663+02', 4, 48, NULL);
INSERT INTO public.temp_orders VALUES (25, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:38:22.156182+02', '2025-08-18 18:38:22.156182+02', 4, 48, NULL);
INSERT INTO public.temp_orders VALUES (26, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:38:53.600455+02', '2025-08-18 18:38:53.600455+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (27, 'pending_owner', NULL, 5.2, '2025-08-17 23:00:00+02', '2025-09-05 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:39:00.284111+02', '2025-08-18 18:39:00.284111+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (28, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:42:53.546748+02', '2025-08-18 18:42:53.546748+02', 4, 6, NULL);
INSERT INTO public.temp_orders VALUES (29, 'pending_owner', NULL, 5, '2025-08-17 23:00:00+02', '2025-08-17 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:42:58.125475+02', '2025-08-18 18:42:58.125475+02', 4, 6, NULL);
INSERT INTO public.temp_orders VALUES (30, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:53:46.937952+02', '2025-08-18 18:53:46.937952+02', 4, 26, NULL);
INSERT INTO public.temp_orders VALUES (31, 'pending_owner', NULL, 6.06, '2025-08-17 23:00:00+02', '2025-08-29 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 18:53:50.221314+02', '2025-08-18 18:53:50.221314+02', 4, 26, NULL);
INSERT INTO public.temp_orders VALUES (32, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:06:42.358586+02', '2025-08-18 19:06:42.358586+02', 4, 25, NULL);
INSERT INTO public.temp_orders VALUES (33, 'pending_owner', NULL, 6.12, '2025-08-30 23:00:00+02', '2025-09-05 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:06:46.497076+02', '2025-08-18 19:06:46.497076+02', 4, 25, NULL);
INSERT INTO public.temp_orders VALUES (34, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:08:40.543828+02', '2025-08-18 19:08:40.543828+02', 4, 25, NULL);
INSERT INTO public.temp_orders VALUES (35, 'pending_owner', NULL, 6.12, '2025-08-18 19:08:00+02', '2025-08-18 19:08:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:08:43.379329+02', '2025-08-18 19:08:43.379329+02', 4, 25, NULL);
INSERT INTO public.temp_orders VALUES (36, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:10:52.570409+02', '2025-08-18 19:10:52.570409+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (37, 'pending_owner', NULL, 5.2, '2025-08-17 23:00:00+02', '2025-08-29 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:11:18.549942+02', '2025-08-18 19:11:18.549942+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (38, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:13:18.781549+02', '2025-08-18 19:13:18.781549+02', 4, 19, NULL);
INSERT INTO public.temp_orders VALUES (39, 'pending_owner', NULL, 9.76, '2025-08-17 23:00:00+02', '2025-08-17 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:13:40.397407+02', '2025-08-18 19:13:40.397407+02', 4, 19, NULL);
INSERT INTO public.temp_orders VALUES (40, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:14:43.315366+02', '2025-08-18 19:14:43.315366+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (41, 'pending_owner', NULL, 5.2, '2025-08-30 23:00:00+02', '2025-08-30 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:14:49.490458+02', '2025-08-18 19:14:49.490458+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (42, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:21:45.197232+02', '2025-08-18 19:21:45.197232+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (43, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:22:29.522906+02', '2025-08-18 19:22:29.522906+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (44, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:22:43.569726+02', '2025-08-18 19:22:43.569726+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (45, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:23:09.615348+02', '2025-08-18 19:23:09.615348+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (46, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:24:14.799244+02', '2025-08-18 19:24:14.799244+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (47, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:24:42.573788+02', '2025-08-18 19:24:42.573788+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (48, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:24:53.583003+02', '2025-08-18 19:24:53.583003+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (49, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:26:18.865185+02', '2025-08-18 19:26:18.865185+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (50, 'pending_owner', NULL, 5.2, '2025-09-17 23:00:00+02', '2025-09-17 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-18 19:26:29.853456+02', '2025-08-18 19:26:29.853456+02', 4, 23, NULL);
INSERT INTO public.temp_orders VALUES (51, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 17:28:43.791011+02', '2025-08-19 17:28:43.791011+02', 5, 23, NULL);
INSERT INTO public.temp_orders VALUES (52, 'pending_owner', NULL, 5.2, '2025-08-31 23:00:00+02', '2025-09-04 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 17:29:09.978565+02', '2025-08-19 17:29:09.978565+02', 5, 23, NULL);
INSERT INTO public.temp_orders VALUES (53, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 17:34:39.802159+02', '2025-08-19 17:34:39.802159+02', 5, 23, NULL);
INSERT INTO public.temp_orders VALUES (54, 'pending_owner', NULL, 5.2, '2025-09-29 23:00:00+02', '2025-10-03 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 17:34:53.422783+02', '2025-08-19 17:34:53.422783+02', 5, 23, NULL);
INSERT INTO public.temp_orders VALUES (55, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 17:44:56.005356+02', '2025-08-19 17:44:56.005356+02', 8, 2, NULL);
INSERT INTO public.temp_orders VALUES (56, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 17:45:10.164337+02', '2025-08-19 17:45:10.164337+02', 8, 19, NULL);
INSERT INTO public.temp_orders VALUES (57, 'pending_owner', NULL, 9.76, '2025-08-19 17:45:00+02', '2025-08-19 17:45:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 17:45:12.721122+02', '2025-08-19 17:45:12.721122+02', 8, 19, NULL);
INSERT INTO public.temp_orders VALUES (58, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 17:49:08.273001+02', '2025-08-19 17:49:08.273001+02', 8, 3, NULL);
INSERT INTO public.temp_orders VALUES (59, 'pending_owner', NULL, 8.7, '2025-08-18 23:00:00+02', '2025-08-22 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 17:49:12.434195+02', '2025-08-19 17:49:12.434195+02', 8, 3, NULL);
INSERT INTO public.temp_orders VALUES (60, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 17:52:17.315368+02', '2025-08-19 17:52:17.315368+02', 5, 11, NULL);
INSERT INTO public.temp_orders VALUES (61, 'pending_owner', NULL, 7.8, '2025-08-18 23:00:00+02', '2025-08-28 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 17:52:21.092497+02', '2025-08-19 17:52:21.092497+02', 5, 11, NULL);
INSERT INTO public.temp_orders VALUES (62, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:00:51.331336+02', '2025-08-19 18:00:51.331336+02', 9, 31, NULL);
INSERT INTO public.temp_orders VALUES (63, 'pending_owner', NULL, 7.2, '2025-08-18 23:00:00+02', '2025-08-21 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:00:56.193341+02', '2025-08-19 18:00:56.193341+02', 9, 31, NULL);
INSERT INTO public.temp_orders VALUES (64, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:02:08.926739+02', '2025-08-19 18:02:08.926739+02', 11, 31, NULL);
INSERT INTO public.temp_orders VALUES (65, 'pending_owner', NULL, 7.2, '2025-08-25 23:00:00+02', '2025-08-27 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:02:12.665721+02', '2025-08-19 18:02:12.665721+02', 11, 31, NULL);
INSERT INTO public.temp_orders VALUES (66, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:04:01.60939+02', '2025-08-19 18:04:01.60939+02', 9, 29, NULL);
INSERT INTO public.temp_orders VALUES (67, 'pending_owner', NULL, 8.81, '2025-09-01 23:00:00+02', '2025-09-04 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:04:07.311788+02', '2025-08-19 18:04:07.311788+02', 9, 29, NULL);
INSERT INTO public.temp_orders VALUES (68, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:05:28.724779+02', '2025-08-19 18:05:28.724779+02', 11, 43, NULL);
INSERT INTO public.temp_orders VALUES (69, 'pending_owner', NULL, 7.6, '2025-08-25 23:00:00+02', '2025-08-28 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:05:32.06668+02', '2025-08-19 18:05:32.06668+02', 11, 43, NULL);
INSERT INTO public.temp_orders VALUES (70, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:10:48.606587+02', '2025-08-19 18:10:48.606587+02', 9, 28, NULL);
INSERT INTO public.temp_orders VALUES (71, 'pending_owner', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-21 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:10:52.05851+02', '2025-08-19 18:10:52.05851+02', 9, 28, NULL);
INSERT INTO public.temp_orders VALUES (72, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:15:09.664687+02', '2025-08-19 18:15:09.664687+02', 9, 7, NULL);
INSERT INTO public.temp_orders VALUES (73, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:15:15.368561+02', '2025-08-19 18:15:15.368561+02', 11, 7, NULL);
INSERT INTO public.temp_orders VALUES (74, 'pending_owner', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-21 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:15:18.325226+02', '2025-08-19 18:15:18.325226+02', 11, 7, NULL);
INSERT INTO public.temp_orders VALUES (75, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:15:26.163377+02', '2025-08-19 18:15:26.163377+02', 9, 7, NULL);
INSERT INTO public.temp_orders VALUES (76, 'pending_owner', NULL, 5, '2025-09-01 23:00:00+02', '2025-09-05 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:15:29.146514+02', '2025-08-19 18:15:29.146514+02', 9, 7, NULL);
INSERT INTO public.temp_orders VALUES (77, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:26:34.234615+02', '2025-08-19 18:26:34.234615+02', 13, 37, NULL);
INSERT INTO public.temp_orders VALUES (78, 'pending_owner', NULL, 8.8, '2025-08-18 23:00:00+02', '2025-08-19 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:26:38.163371+02', '2025-08-19 18:26:38.163371+02', 13, 37, NULL);
INSERT INTO public.temp_orders VALUES (79, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:30:05.507853+02', '2025-08-19 18:30:05.507853+02', 14, 18, NULL);
INSERT INTO public.temp_orders VALUES (80, 'pending_owner', NULL, 8.95, '2025-08-18 23:00:00+02', '2025-09-05 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:30:08.652201+02', '2025-08-19 18:30:08.652201+02', 14, 18, NULL);
INSERT INTO public.temp_orders VALUES (81, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:30:53.604902+02', '2025-08-19 18:30:53.604902+02', 13, 36, NULL);
INSERT INTO public.temp_orders VALUES (82, 'pending_owner', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-21 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:30:57.074536+02', '2025-08-19 18:30:57.074536+02', 13, 36, NULL);
INSERT INTO public.temp_orders VALUES (83, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:32:00.757028+02', '2025-08-19 18:32:00.757028+02', 13, 36, NULL);
INSERT INTO public.temp_orders VALUES (84, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:32:06.228644+02', '2025-08-19 18:32:06.228644+02', 13, 14, NULL);
INSERT INTO public.temp_orders VALUES (85, 'pending_owner', NULL, 5.07, '2025-08-18 23:00:00+02', '2025-08-26 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:32:09.624739+02', '2025-08-19 18:32:09.624739+02', 13, 14, NULL);
INSERT INTO public.temp_orders VALUES (91, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:40:24.167344+02', '2025-08-19 18:40:24.167344+02', 13, 32, NULL);
INSERT INTO public.temp_orders VALUES (92, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:40:27.21077+02', '2025-08-19 18:40:27.21077+02', 14, 32, NULL);
INSERT INTO public.temp_orders VALUES (93, 'pending_owner', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-22 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:40:30.535259+02', '2025-08-19 18:40:30.535259+02', 14, 32, NULL);
INSERT INTO public.temp_orders VALUES (94, 'pending_owner', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-21 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:40:37.468075+02', '2025-08-19 18:40:37.468075+02', 13, 32, NULL);
INSERT INTO public.temp_orders VALUES (95, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:41:58.845499+02', '2025-08-19 18:41:58.845499+02', 13, 32, NULL);
INSERT INTO public.temp_orders VALUES (104, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:05:38.911868+02', '2025-08-19 19:05:38.911868+02', 13, 37, NULL);
INSERT INTO public.temp_orders VALUES (105, 'pending_owner', NULL, 8.8, '2025-08-18 23:00:00+02', '2025-08-20 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:05:42.738828+02', '2025-08-19 19:05:42.738828+02', 13, 37, NULL);
INSERT INTO public.temp_orders VALUES (106, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:05:54.690577+02', '2025-08-19 19:05:54.690577+02', 13, 37, NULL);
INSERT INTO public.temp_orders VALUES (107, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:05:58.111416+02', '2025-08-19 19:05:58.111416+02', 13, 36, NULL);
INSERT INTO public.temp_orders VALUES (108, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:06:01.344835+02', '2025-08-19 19:06:01.344835+02', 14, 36, NULL);
INSERT INTO public.temp_orders VALUES (109, 'pending_owner', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-20 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:06:05.230651+02', '2025-08-19 19:06:05.230651+02', 14, 36, NULL);
INSERT INTO public.temp_orders VALUES (110, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:09:12.264525+02', '2025-08-19 19:09:12.264525+02', 13, 6, NULL);
INSERT INTO public.temp_orders VALUES (111, 'pending_owner', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-27 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:09:15.886219+02', '2025-08-19 19:09:15.886219+02', 13, 6, NULL);
INSERT INTO public.temp_orders VALUES (112, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:09:27.686438+02', '2025-08-19 19:09:27.686438+02', 13, 36, NULL);
INSERT INTO public.temp_orders VALUES (113, 'pending_owner', NULL, 5, '2025-08-18 23:00:00+02', '2025-08-25 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:09:31.133796+02', '2025-08-19 19:09:31.133796+02', 13, 36, NULL);
INSERT INTO public.temp_orders VALUES (114, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:09:37.064941+02', '2025-08-19 19:09:37.064941+02', 14, 36, NULL);
INSERT INTO public.temp_orders VALUES (115, 'pending_owner', NULL, 5, '2025-08-18 23:00:00+02', '2025-09-05 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:09:43.059031+02', '2025-08-19 19:09:43.059031+02', 14, 36, NULL);
INSERT INTO public.temp_orders VALUES (116, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:15:31.043885+02', '2025-08-19 19:15:31.043885+02', 13, 31, NULL);
INSERT INTO public.temp_orders VALUES (117, 'pending_owner', NULL, 7.2, '2025-08-19 19:15:00+02', '2025-08-19 19:15:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:15:34.132997+02', '2025-08-19 19:15:34.132997+02', 13, 31, NULL);
INSERT INTO public.temp_orders VALUES (118, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:15:48.901867+02', '2025-08-19 19:15:48.901867+02', 14, 16, NULL);
INSERT INTO public.temp_orders VALUES (119, 'pending_owner', NULL, 7.61, '2025-09-05 23:00:00+02', '2025-09-05 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:15:54.122044+02', '2025-08-19 19:15:54.122044+02', 14, 16, NULL);
INSERT INTO public.temp_orders VALUES (120, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:18:43.859957+02', '2025-08-19 19:18:43.859957+02', 14, 28, NULL);
INSERT INTO public.temp_orders VALUES (121, 'pending_owner', NULL, 5, '2025-08-23 23:00:00+02', '2025-08-27 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:18:52.24081+02', '2025-08-19 19:18:52.24081+02', 14, 28, NULL);
INSERT INTO public.temp_orders VALUES (122, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:20:46.62279+02', '2025-08-19 19:20:46.62279+02', 14, 28, NULL);
INSERT INTO public.temp_orders VALUES (123, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:20:49.753904+02', '2025-08-19 19:20:49.753904+02', 14, 43, NULL);
INSERT INTO public.temp_orders VALUES (124, 'pending_owner', NULL, 7.6, '2025-08-18 23:00:00+02', '2025-08-18 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:20:52.58115+02', '2025-08-19 19:20:52.58115+02', 14, 43, NULL);
INSERT INTO public.temp_orders VALUES (86, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:33:14.661342+02', '2025-08-19 18:33:14.661342+02', 13, 14, NULL);
INSERT INTO public.temp_orders VALUES (87, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:33:21.207813+02', '2025-08-19 18:33:21.207813+02', 14, 14, NULL);
INSERT INTO public.temp_orders VALUES (88, 'pending_owner', NULL, 5.07, '2025-09-01 23:00:00+02', '2025-09-04 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:33:24.453889+02', '2025-08-19 18:33:24.453889+02', 14, 14, NULL);
INSERT INTO public.temp_orders VALUES (89, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:34:30.954504+02', '2025-08-19 18:34:30.954504+02', 13, 14, NULL);
INSERT INTO public.temp_orders VALUES (90, 'pending_owner', NULL, 5.07, '2025-08-19 18:34:00+02', '2025-08-19 18:34:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:34:34.08952+02', '2025-08-19 18:34:34.08952+02', 13, 14, NULL);
INSERT INTO public.temp_orders VALUES (96, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:42:41.368252+02', '2025-08-19 18:42:41.368252+02', 14, 32, NULL);
INSERT INTO public.temp_orders VALUES (97, 'pending_owner', NULL, 5, '2025-08-24 23:00:00+02', '2025-08-27 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:42:44.357881+02', '2025-08-19 18:42:44.357881+02', 14, 32, NULL);
INSERT INTO public.temp_orders VALUES (98, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:42:57.246617+02', '2025-08-19 18:42:57.246617+02', 13, 32, NULL);
INSERT INTO public.temp_orders VALUES (99, 'pending_owner', NULL, 5, '2025-08-26 23:00:00+02', '2025-08-28 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:43:00.127725+02', '2025-08-19 18:43:00.127725+02', 13, 32, NULL);
INSERT INTO public.temp_orders VALUES (100, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:44:00.579347+02', '2025-08-19 18:44:00.579347+02', 13, 32, NULL);
INSERT INTO public.temp_orders VALUES (101, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:44:07.234878+02', '2025-08-19 18:44:07.234878+02', 14, 32, NULL);
INSERT INTO public.temp_orders VALUES (102, 'pending_owner', NULL, 5, '2025-09-02 23:00:00+02', '2025-09-03 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:44:10.946803+02', '2025-08-19 18:44:10.946803+02', 14, 32, NULL);
INSERT INTO public.temp_orders VALUES (103, 'pending_owner', NULL, 5, '2025-09-03 23:00:00+02', '2025-09-05 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 18:44:19.185612+02', '2025-08-19 18:44:19.185612+02', 13, 32, NULL);
INSERT INTO public.temp_orders VALUES (125, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:30:18.04479+02', '2025-08-19 19:30:18.04479+02', 13, 26, NULL);
INSERT INTO public.temp_orders VALUES (126, 'pending_owner', NULL, 6.06, '2025-08-18 23:00:00+02', '2025-08-18 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:30:21.141368+02', '2025-08-19 19:30:21.141368+02', 13, 26, NULL);
INSERT INTO public.temp_orders VALUES (127, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:30:27.0638+02', '2025-08-19 19:30:27.0638+02', 14, 26, NULL);
INSERT INTO public.temp_orders VALUES (128, 'pending_owner', NULL, 6.06, '2025-08-25 23:00:00+02', '2025-08-25 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:30:29.808021+02', '2025-08-19 19:30:29.808021+02', 14, 26, NULL);
INSERT INTO public.temp_orders VALUES (129, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:32:43.817923+02', '2025-08-19 19:32:43.817923+02', 13, 26, NULL);
INSERT INTO public.temp_orders VALUES (130, 'pending_owner', NULL, 6.06, '2025-08-19 19:32:00+02', '2025-08-19 19:32:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:32:46.472378+02', '2025-08-19 19:32:46.472378+02', 13, 26, NULL);
INSERT INTO public.temp_orders VALUES (131, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:32:57.196911+02', '2025-08-19 19:32:57.196911+02', 14, 26, NULL);
INSERT INTO public.temp_orders VALUES (132, 'pending_owner', NULL, 6.06, '2025-08-19 19:32:00+02', '2025-08-19 19:32:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:32:59.823332+02', '2025-08-19 19:32:59.823332+02', 14, 26, NULL);
INSERT INTO public.temp_orders VALUES (133, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:37:44.839456+02', '2025-08-19 19:37:44.839456+02', 13, 26, NULL);
INSERT INTO public.temp_orders VALUES (134, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:37:48.737272+02', '2025-08-19 19:37:48.737272+02', 13, 26, NULL);
INSERT INTO public.temp_orders VALUES (135, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:37:53.415067+02', '2025-08-19 19:37:53.415067+02', 13, 6, NULL);
INSERT INTO public.temp_orders VALUES (136, 'pending_owner', NULL, 5, '2025-09-30 23:00:00+02', '2025-12-31 00:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:38:01.799211+02', '2025-08-19 19:38:01.799211+02', 13, 6, NULL);
INSERT INTO public.temp_orders VALUES (137, 'pending_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:38:09.839274+02', '2025-08-19 19:38:09.839274+02', 1, 6, NULL);
INSERT INTO public.temp_orders VALUES (138, 'pending_owner', NULL, 5, '2025-08-31 23:00:00+02', '2025-11-30 00:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-19 19:38:16.600137+02', '2025-08-19 19:38:16.600137+02', 1, 6, NULL);


--
-- TOC entry 5177 (class 0 OID 962049)
-- Dependencies: 226
-- Data for Name: two_factor_auth_codes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5181 (class 0 OID 962076)
-- Dependencies: 230
-- Data for Name: user_documents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5187 (class 0 OID 962128)
-- Dependencies: 236
-- Data for Name: user_event_logs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.user_event_logs VALUES (1, 'admin@ydk.com', 'admin', 'User create a listing with name ''Men''s low-top sneakers Puma Rebound v6 Low 39232843 44''', '2025-08-10 11:55:33.50505+02', '2025-08-10 11:55:33.50505+02', 1);
INSERT INTO public.user_event_logs VALUES (2, 'admin@ydk.com', 'admin', 'User update a listing with name ''Men''s low-top sneakers Puma Rebound v6 Low 39232843 44''', '2025-08-10 12:03:05.433071+02', '2025-08-10 12:03:05.433071+02', 1);
INSERT INTO public.user_event_logs VALUES (3, 'admin@ydk.com', 'admin', 'Admin update a listing with name ''Men''s low-top sneakers Puma Rebound v6 Low 39232843 44''', '2025-08-10 12:06:52.641432+02', '2025-08-10 12:06:52.641432+02', 1);
INSERT INTO public.user_event_logs VALUES (4, 'admin@gmail.com', 'admin', 'Created user. Generated id ''4''', '2025-08-17 12:38:05.894394+02', '2025-08-17 12:38:05.894394+02', 1);
INSERT INTO public.user_event_logs VALUES (5, 'admin@gmail.com', 'admin', 'Created user. Generated id ''5''', '2025-08-17 12:39:27.840548+02', '2025-08-17 12:39:27.840548+02', 1);
INSERT INTO public.user_event_logs VALUES (6, 'admin@gmail.com', 'admin', 'Updated user with id ''5''', '2025-08-17 12:39:54.058445+02', '2025-08-17 12:39:54.058445+02', 1);
INSERT INTO public.user_event_logs VALUES (7, 'admin@gmail.com', 'admin', 'Created user. Generated id ''6''', '2025-08-17 12:41:50.008399+02', '2025-08-17 12:41:50.008399+02', 1);
INSERT INTO public.user_event_logs VALUES (8, 'admin@gmail.com', 'admin', 'Updated user with id ''6''', '2025-08-17 12:42:01.254366+02', '2025-08-17 12:42:01.254366+02', 1);
INSERT INTO public.user_event_logs VALUES (9, 'admin@gmail.com', 'admin', 'Created user. Generated id ''7''', '2025-08-17 12:44:04.181683+02', '2025-08-17 12:44:04.181683+02', 1);
INSERT INTO public.user_event_logs VALUES (10, 'admin@gmail.com', 'admin', 'Created user. Generated id ''8''', '2025-08-17 12:47:19.287968+02', '2025-08-17 12:47:19.287968+02', 1);
INSERT INTO public.user_event_logs VALUES (11, 'admin@gmail.com', 'admin', 'Created user. Generated id ''9''', '2025-08-17 12:48:50.229093+02', '2025-08-17 12:48:50.229093+02', 1);
INSERT INTO public.user_event_logs VALUES (12, 'admin@gmail.com', 'admin', 'Updated user with id ''9''', '2025-08-17 12:49:47.140241+02', '2025-08-17 12:49:47.140241+02', 1);
INSERT INTO public.user_event_logs VALUES (13, 'admin@gmail.com', 'admin', 'Created user. Generated id ''10''', '2025-08-17 12:51:32.437638+02', '2025-08-17 12:51:32.437638+02', 1);
INSERT INTO public.user_event_logs VALUES (14, 'admin@gmail.com', 'admin', 'Created user. Generated id ''11''', '2025-08-17 12:54:13.383651+02', '2025-08-17 12:54:13.383651+02', 1);
INSERT INTO public.user_event_logs VALUES (15, 'admin@gmail.com', 'admin', 'Updated user with id ''11''', '2025-08-17 12:54:31.297845+02', '2025-08-17 12:54:31.297845+02', 1);
INSERT INTO public.user_event_logs VALUES (16, 'admin@gmail.com', 'admin', 'Created user. Generated id ''12''', '2025-08-17 12:55:54.648844+02', '2025-08-17 12:55:54.648844+02', 1);
INSERT INTO public.user_event_logs VALUES (17, 'admin@gmail.com', 'admin', 'Created user. Generated id ''13''', '2025-08-17 12:57:30.818283+02', '2025-08-17 12:57:30.818283+02', 1);
INSERT INTO public.user_event_logs VALUES (18, 'admin@gmail.com', 'admin', 'Created user. Generated id ''14''', '2025-08-17 12:58:46.690603+02', '2025-08-17 12:58:46.690603+02', 1);
INSERT INTO public.user_event_logs VALUES (19, 'admin@gmail.com', 'admin', 'Created user. Generated id ''15''', '2025-08-17 13:01:47.478507+02', '2025-08-17 13:01:47.478507+02', 1);
INSERT INTO public.user_event_logs VALUES (20, 'admin@gmail.com', 'admin', 'Created user. Generated id ''16''', '2025-08-17 13:03:01.254004+02', '2025-08-17 13:03:01.254004+02', 1);
INSERT INTO public.user_event_logs VALUES (21, 'admin@gmail.com', 'admin', 'Created user. Generated id ''17''', '2025-08-17 13:04:08.704905+02', '2025-08-17 13:04:08.704905+02', 1);
INSERT INTO public.user_event_logs VALUES (22, 'admin@gmail.com', 'admin', 'Created user. Generated id ''18''', '2025-08-17 13:06:46.646749+02', '2025-08-17 13:06:46.646749+02', 1);
INSERT INTO public.user_event_logs VALUES (23, 'admin@gmail.com', 'admin', 'Created user. Generated id ''19''', '2025-08-17 13:08:24.138214+02', '2025-08-17 13:08:24.138214+02', 1);
INSERT INTO public.user_event_logs VALUES (24, 'admin@gmail.com', 'admin', 'Created user. Generated id ''20''', '2025-08-17 13:09:40.972353+02', '2025-08-17 13:09:40.972353+02', 1);
INSERT INTO public.user_event_logs VALUES (25, 'admin@gmail.com', 'admin', 'Created user. Generated id ''21''', '2025-08-17 13:11:27.096346+02', '2025-08-17 13:11:27.096346+02', 1);
INSERT INTO public.user_event_logs VALUES (26, 'admin@gmail.com', 'admin', 'Created user. Generated id ''22''', '2025-08-17 13:13:40.035547+02', '2025-08-17 13:13:40.035547+02', 1);
INSERT INTO public.user_event_logs VALUES (27, 'admin@gmail.com', 'admin', 'Created user. Generated id ''23''', '2025-08-17 13:31:19.35461+02', '2025-08-17 13:31:19.35461+02', 1);
INSERT INTO public.user_event_logs VALUES (28, 'admin@gmail.com', 'admin', 'Created user. Generated id ''24''', '2025-08-17 13:32:46.361504+02', '2025-08-17 13:32:46.361504+02', 1);
INSERT INTO public.user_event_logs VALUES (29, 'admin@gmail.com', 'admin', 'Created user. Generated id ''25''', '2025-08-17 13:34:29.358375+02', '2025-08-17 13:34:29.358375+02', 1);
INSERT INTO public.user_event_logs VALUES (30, 'admin@gmail.com', 'admin', 'Created user. Generated id ''26''', '2025-08-17 13:35:39.837531+02', '2025-08-17 13:35:39.837531+02', 1);
INSERT INTO public.user_event_logs VALUES (31, 'admin@gmail.com', 'admin', 'Created user. Generated id ''27''', '2025-08-17 13:36:58.155112+02', '2025-08-17 13:36:58.155112+02', 1);
INSERT INTO public.user_event_logs VALUES (32, 'admin@gmail.com', 'admin', 'Created user. Generated id ''28''', '2025-08-17 13:39:01.904474+02', '2025-08-17 13:39:01.904474+02', 1);
INSERT INTO public.user_event_logs VALUES (33, 'admin@gmail.com', 'admin', 'Created user. Generated id ''29''', '2025-08-17 13:40:03.767125+02', '2025-08-17 13:40:03.767125+02', 1);
INSERT INTO public.user_event_logs VALUES (34, 'admin@gmail.com', 'admin', 'Created user. Generated id ''30''', '2025-08-17 13:42:16.520407+02', '2025-08-17 13:42:16.520407+02', 1);
INSERT INTO public.user_event_logs VALUES (35, 'admin@gmail.com', 'admin', 'Created user. Generated id ''31''', '2025-08-17 13:44:19.952836+02', '2025-08-17 13:44:19.952836+02', 1);
INSERT INTO public.user_event_logs VALUES (36, 'admin@gmail.com', 'admin', 'Created user. Generated id ''32''', '2025-08-17 13:45:50.081879+02', '2025-08-17 13:45:50.081879+02', 1);
INSERT INTO public.user_event_logs VALUES (37, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Loafers''', '2025-08-17 14:48:42.905965+02', '2025-08-17 14:48:42.905965+02', 1);
INSERT INTO public.user_event_logs VALUES (38, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''T-shirt''', '2025-08-17 15:04:40.545054+02', '2025-08-17 15:04:40.545054+02', 1);
INSERT INTO public.user_event_logs VALUES (39, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Kids jacket''', '2025-08-17 15:07:15.538162+02', '2025-08-17 15:07:15.538162+02', 1);
INSERT INTO public.user_event_logs VALUES (40, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Overall''', '2025-08-17 15:10:17.45171+02', '2025-08-17 15:10:17.45171+02', 1);
INSERT INTO public.user_event_logs VALUES (41, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Sweater''', '2025-08-17 15:12:47.333048+02', '2025-08-17 15:12:47.333048+02', 1);
INSERT INTO public.user_event_logs VALUES (42, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Sweatshirt''', '2025-08-17 15:15:14.387644+02', '2025-08-17 15:15:14.387644+02', 1);
INSERT INTO public.user_event_logs VALUES (43, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Jacket''', '2025-08-17 15:20:54.459867+02', '2025-08-17 15:20:54.459867+02', 1);
INSERT INTO public.user_event_logs VALUES (44, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Romper''', '2025-08-17 15:23:18.422887+02', '2025-08-17 15:23:18.422887+02', 1);
INSERT INTO public.user_event_logs VALUES (45, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Suit''', '2025-08-17 15:25:18.4704+02', '2025-08-17 15:25:18.4704+02', 1);
INSERT INTO public.user_event_logs VALUES (46, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Shirt''', '2025-08-17 15:29:18.51256+02', '2025-08-17 15:29:18.51256+02', 1);
INSERT INTO public.user_event_logs VALUES (47, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Casual shirt''', '2025-08-17 15:41:48.55112+02', '2025-08-17 15:41:48.55112+02', 1);
INSERT INTO public.user_event_logs VALUES (48, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Ring''', '2025-08-17 15:44:36.199689+02', '2025-08-17 15:44:36.199689+02', 1);
INSERT INTO public.user_event_logs VALUES (49, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Onesie''', '2025-08-17 15:47:01.117934+02', '2025-08-17 15:47:01.117934+02', 1);
INSERT INTO public.user_event_logs VALUES (50, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Evening dress''', '2025-08-17 15:50:26.800431+02', '2025-08-17 15:50:26.800431+02', 1);
INSERT INTO public.user_event_logs VALUES (51, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Toddler Girl Dresses''', '2025-08-17 15:53:54.785343+02', '2025-08-17 15:53:54.785343+02', 1);
INSERT INTO public.user_event_logs VALUES (52, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Business suit''', '2025-08-17 15:56:42.125516+02', '2025-08-17 15:56:42.125516+02', 1);
INSERT INTO public.user_event_logs VALUES (53, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Cap''', '2025-08-17 15:59:07.177958+02', '2025-08-17 15:59:07.177958+02', 1);
INSERT INTO public.user_event_logs VALUES (54, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Handbag''', '2025-08-17 16:01:48.818827+02', '2025-08-17 16:01:48.818827+02', 1);
INSERT INTO public.user_event_logs VALUES (55, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Jacket''', '2025-08-17 16:05:03.628516+02', '2025-08-17 16:05:03.628516+02', 1);
INSERT INTO public.user_event_logs VALUES (56, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Long skirt''', '2025-08-17 16:07:57.778504+02', '2025-08-17 16:07:57.778504+02', 1);
INSERT INTO public.user_event_logs VALUES (57, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Casual dress''', '2025-08-17 16:10:02.440178+02', '2025-08-17 16:10:02.440178+02', 1);
INSERT INTO public.user_event_logs VALUES (58, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Bracelet''', '2025-08-17 16:11:37.748813+02', '2025-08-17 16:11:37.748813+02', 1);
INSERT INTO public.user_event_logs VALUES (59, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Leggings''', '2025-08-17 16:14:11.336348+02', '2025-08-17 16:14:11.336348+02', 1);
INSERT INTO public.user_event_logs VALUES (60, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Tracksuit''', '2025-08-17 16:21:12.012176+02', '2025-08-17 16:21:12.012176+02', 1);
INSERT INTO public.user_event_logs VALUES (61, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Ring''', '2025-08-17 16:23:30.32199+02', '2025-08-17 16:23:30.32199+02', 1);
INSERT INTO public.user_event_logs VALUES (62, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Necklace''', '2025-08-17 16:25:07.531545+02', '2025-08-17 16:25:07.531545+02', 1);
INSERT INTO public.user_event_logs VALUES (63, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Blouse''', '2025-08-17 16:26:53.516201+02', '2025-08-17 16:26:53.516201+02', 1);
INSERT INTO public.user_event_logs VALUES (64, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Jacket''', '2025-08-17 16:29:23.589215+02', '2025-08-17 16:29:23.589215+02', 1);
INSERT INTO public.user_event_logs VALUES (65, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Trench Coats''', '2025-08-17 16:33:02.569411+02', '2025-08-17 16:33:02.569411+02', 1);
INSERT INTO public.user_event_logs VALUES (66, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Sunglasses''', '2025-08-17 16:35:09.860806+02', '2025-08-17 16:35:09.860806+02', 1);
INSERT INTO public.user_event_logs VALUES (67, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Flip flops''', '2025-08-17 16:36:56.960592+02', '2025-08-17 16:36:56.960592+02', 1);
INSERT INTO public.user_event_logs VALUES (68, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Jacket''', '2025-08-17 16:42:41.811039+02', '2025-08-17 16:42:41.811039+02', 1);
INSERT INTO public.user_event_logs VALUES (69, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Sneakers''', '2025-08-17 16:44:27.784792+02', '2025-08-17 16:44:27.784792+02', 1);
INSERT INTO public.user_event_logs VALUES (70, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Pants''', '2025-08-17 16:46:19.110557+02', '2025-08-17 16:46:19.110557+02', 1);
INSERT INTO public.user_event_logs VALUES (71, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Leggings''', '2025-08-17 16:49:54.688063+02', '2025-08-17 16:49:54.688063+02', 1);
INSERT INTO public.user_event_logs VALUES (72, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Tracksuit''', '2025-08-17 16:53:03.659791+02', '2025-08-17 16:53:03.659791+02', 1);
INSERT INTO public.user_event_logs VALUES (73, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Long skirt''', '2025-08-17 16:55:02.585693+02', '2025-08-17 16:55:02.585693+02', 1);
INSERT INTO public.user_event_logs VALUES (74, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Organic Hemp''', '2025-08-17 16:57:22.050262+02', '2025-08-17 16:57:22.050262+02', 1);
INSERT INTO public.user_event_logs VALUES (75, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Pants''', '2025-08-17 17:01:00.806059+02', '2025-08-17 17:01:00.806059+02', 1);
INSERT INTO public.user_event_logs VALUES (76, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Sunglasses''', '2025-08-17 17:02:33.32186+02', '2025-08-17 17:02:33.32186+02', 1);
INSERT INTO public.user_event_logs VALUES (77, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Skirt''', '2025-08-17 20:56:27.827446+02', '2025-08-17 20:56:27.827446+02', 1);
INSERT INTO public.user_event_logs VALUES (78, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Ankle boots''', '2025-08-17 20:59:28.640058+02', '2025-08-17 20:59:28.640058+02', 1);
INSERT INTO public.user_event_logs VALUES (79, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Blazer''', '2025-08-17 21:02:29.162989+02', '2025-08-17 21:02:29.162989+02', 1);
INSERT INTO public.user_event_logs VALUES (80, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Silk blouse''', '2025-08-17 21:04:23.154927+02', '2025-08-17 21:04:23.154927+02', 1);
INSERT INTO public.user_event_logs VALUES (81, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Dress shoes''', '2025-08-17 21:06:12.851366+02', '2025-08-17 21:06:12.851366+02', 1);
INSERT INTO public.user_event_logs VALUES (82, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Blouse''', '2025-08-17 21:08:59.539813+02', '2025-08-17 21:08:59.539813+02', 1);
INSERT INTO public.user_event_logs VALUES (83, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Footwear''', '2025-08-17 21:10:44.75465+02', '2025-08-17 21:10:44.75465+02', 1);
INSERT INTO public.user_event_logs VALUES (84, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''T-shirt''', '2025-08-17 21:18:40.191211+02', '2025-08-17 21:18:40.191211+02', 1);
INSERT INTO public.user_event_logs VALUES (85, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Devil costume''', '2025-08-17 21:22:48.167862+02', '2025-08-17 21:22:48.167862+02', 1);
INSERT INTO public.user_event_logs VALUES (86, 'admin@gmail.com', 'admin', 'Admin create a listing with name ''Necklace''', '2025-08-17 21:25:36.462514+02', '2025-08-17 21:25:36.462514+02', 1);


--
-- TOC entry 5211 (class 0 OID 962343)
-- Dependencies: 260
-- Data for Name: user_listing_favorites; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5185 (class 0 OID 962110)
-- Dependencies: 234
-- Data for Name: user_verify_requests; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5171 (class 0 OID 961993)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (14, 'Joseph Mccall', 'tinastephens@bates.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', NULL, 'users/dd15d7874803bae41171.jpeg', NULL, false, true, true, false, false, true, false, false, NULL, NULL, 'https://instagram.com/brenda56', '7c133bc0', true, false, '2025-08-17 12:58:46.68604+02', '2025-08-17 12:58:46.68604+02');
INSERT INTO public.users VALUES (13, 'Cheryl Keith', 'thomasanderson@aguilar.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Property everybody suffer process news best Democrat event how price site.', 'users/5b4707cbc062d1281eaa.jpeg', NULL, false, true, true, false, false, true, false, false, NULL, 'https://linkedin.com/in/nryan', NULL, 'kGVSRLhnA7to', true, false, '2025-08-17 12:57:30.810516+02', '2025-08-17 12:57:30.810516+02');
INSERT INTO public.users VALUES (12, 'Theresa Baker MD', 'emilyparsons@gmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Sound rock growth compare too general make which where.', 'users/e57042a3d89e54732137.jpeg', '380663253489', true, true, true, false, false, true, false, false, 'https://facebook.com/david28', NULL, NULL, 'a722e661', true, false, '2025-08-17 12:55:54.643181+02', '2025-08-17 12:55:54.643181+02');
INSERT INTO public.users VALUES (5, 'Erica Kim', 'emily50@delacruz.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'International door direction number every amount.', 'users/ba90478ddf8b7e720000.jpeg', '380662524418', true, true, true, false, true, true, false, false, NULL, NULL, NULL, 'd496f4bf', true, false, '2025-08-17 12:39:27.835984+02', '2025-08-17 12:39:27.835984+02');
INSERT INTO public.users VALUES (2, 'tester', 'test@gmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', '', '', NULL, false, true, false, false, true, true, false, false, NULL, NULL, NULL, NULL, true, false, '2025-08-10 12:05:02.914295+02', '2025-08-10 12:05:02.914295+02');
INSERT INTO public.users VALUES (6, 'Carrie Thomas', 'theodorehenry@yahoo.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Author Republican why beautiful teacher which public enough maintain couple idea.', 'users/1de34bf9a9e7f5cce371.jpeg', '380674236558', true, true, true, false, true, true, false, false, 'https://facebook.com/taylorshawn', 'https://linkedin.com/in/ecollins', 'https://instagram.com/brett85', 'de1ac9a4', true, false, '2025-08-17 12:41:50.000354+02', '2025-08-17 12:41:50.000354+02');
INSERT INTO public.users VALUES (26, 'Taylor Decker', 'sarahgomez@schultz-lin.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Adult board experience decision technology message.', 'users/e719f33aacad8812de18.jpeg', NULL, false, true, true, false, false, true, false, false, 'https://facebook.com/logancurtis', NULL, NULL, 'eaee4327', true, false, '2025-08-17 13:35:39.829949+02', '2025-08-17 13:35:39.829949+02');
INSERT INTO public.users VALUES (10, 'Sara Mueller', 'uglover@erickson-byrd.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Make character sport open sing take television specific management miss.', 'users/30bf463f04e10a72148f.jpeg', '380669271708', true, true, true, false, false, true, false, false, 'https://facebook.com/michaeljohnson', 'https://linkedin.com/in/perrysean', NULL, 'e9dc3319', true, false, '2025-08-17 12:51:32.43273+02', '2025-08-17 12:51:32.43273+02');
INSERT INTO public.users VALUES (8, 'Sandra Osborn', 'iharris@hotmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Product newspaper price nearly point Congress war different.', 'users/e91559bd3c0330fe5e9d.jpeg', '380666440342', true, true, true, false, false, true, false, false, NULL, 'https://linkedin.com/in/zfowler', 'https://instagram.com/nancy53', '5889b946', true, false, '2025-08-17 12:47:19.284473+02', '2025-08-17 12:47:19.284473+02');
INSERT INTO public.users VALUES (25, 'Tiffany Gray', 'taylorwebb@hodges.org', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Stock both decision set simply level nation available.', 'users/4b3ec2cc7eaf2a8baaf6.jpeg', '380661236842', true, true, true, false, false, true, false, false, 'https://facebook.com/gsanders', 'https://linkedin.com/in/epeterson', 'https://instagram.com/lynn99', 'c19e80b7', true, false, '2025-08-17 13:34:29.351501+02', '2025-08-17 13:34:29.351501+02');
INSERT INTO public.users VALUES (24, 'Jose Hobbs', 'riverabriana@yahoo.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Health hit form finally billion sound again better describe travel.', 'users/a6a22ffaee5b07d4954b.jpeg', '380667765081', true, true, true, false, false, true, false, false, 'https://facebook.com/scottgolden', 'https://linkedin.com/in/iromero', 'https://instagram.com/proctorrobert', 'fb7f6628', true, false, '2025-08-17 13:32:46.35461+02', '2025-08-17 13:32:46.35461+02');
INSERT INTO public.users VALUES (23, 'Dawn Wolfe', 'xbell@hotmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Forward and whether argue seem garden tough plan yeah bring.', 'users/ad10f2d6569054c335c6.jpeg', '380665434478', true, true, true, false, false, true, false, false, 'https://facebook.com/chapmanbeverly', 'https://linkedin.com/in/vbrown', NULL, '1b425272', true, false, '2025-08-17 13:31:19.347167+02', '2025-08-17 13:31:19.347167+02');
INSERT INTO public.users VALUES (21, 'Russell Humphrey', 'mlewis@cook.org', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Break difference card travel deal interview clearly girl who.', 'users/e392d8a41962b73a901d.jpeg', '380661239821', true, true, true, false, false, true, false, false, 'https://facebook.com/russellsmith', 'https://linkedin.com/in/brettkidd', NULL, '3759fdfb', true, false, '2025-08-17 13:11:27.091942+02', '2025-08-17 13:11:27.091942+02');
INSERT INTO public.users VALUES (20, 'Kelsey Rojas', 'baileyjoshua@pittman.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'More subject join reality issue lay type her ago.', 'users/ce6a6666a593cdf016a7.jpeg', NULL, false, true, true, false, false, true, false, false, 'https://facebook.com/tracythompson', 'https://linkedin.com/in/laura90', NULL, '108d38ad', true, false, '2025-08-17 13:09:40.968724+02', '2025-08-17 13:09:40.968724+02');
INSERT INTO public.users VALUES (19, 'Renee Branch', 'nicholas86@nixon.org', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Hundred affect her east single bed herself full mind true order.', 'users/cd303cc1ff9347e41682.jpeg', '380964222541', true, true, true, false, false, true, false, false, 'https://facebook.com/cooperrebecca', NULL, NULL, '6aa8aa6b', true, false, '2025-08-17 13:08:24.122889+02', '2025-08-17 13:08:24.122889+02');
INSERT INTO public.users VALUES (18, 'Crystal Morrow', 'jturner@thompson.biz', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Room mission business center ten letter goal begin year.', 'users/6ddc3f61ff9a233974f6.jpeg', '380676678246', true, true, true, false, false, true, false, false, 'https://facebook.com/handerson', 'https://linkedin.com/in/andrew32', 'https://instagram.com/knapprobert', '9973ecc1', true, false, '2025-08-17 13:06:46.641678+02', '2025-08-17 13:06:46.641678+02');
INSERT INTO public.users VALUES (17, 'Jodi Zimmerman', 'khartman@yahoo.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Structure model job fund Republican one determine.', 'users/037540811f9e699f4421.jpeg', '380662259015', true, true, true, false, false, true, false, false, NULL, NULL, NULL, 'f19ec452', true, false, '2025-08-17 13:04:08.698832+02', '2025-08-17 13:04:08.698832+02');
INSERT INTO public.users VALUES (15, 'Craig Dennis', 'brittanycook@gmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Call according responsibility huge contain successful million can important score.', 'users/35aa5950f8ca5025c285.jpeg', '380666584442', true, true, true, false, false, true, false, false, 'https://facebook.com/colerandall', NULL, 'https://instagram.com/qsanders', 'ae3e8107', true, false, '2025-08-17 13:01:47.474004+02', '2025-08-17 13:01:47.474004+02');
INSERT INTO public.users VALUES (7, 'Juan Wilson', 'mackpaul@hotmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Report tend thank deal major agent through.', 'users/3a4c96ef8066a42832ec.jpeg', '380964236558', true, true, true, false, true, true, false, false, 'https://facebook.com/mgardner', NULL, NULL, '93d3f49c', true, false, '2025-08-17 12:44:04.176978+02', '2025-08-17 12:44:04.176978+02');
INSERT INTO public.users VALUES (9, 'Matthew Moss', 'lindaward@gibbs.net', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Everything best free piece fact future.', 'users/aa7eceb3a969aea6d367.jpeg', '380661256349', true, true, true, false, false, true, false, false, NULL, 'https://linkedin.com/in/lisaharrington', NULL, 'ad665ea9', true, false, '2025-08-17 12:48:50.219283+02', '2025-08-17 12:48:50.219283+02');
INSERT INTO public.users VALUES (27, 'Monica Freeman', 'rcarter@yahoo.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Card course increase prove agency above become get social.', 'users/73be5ae8e2b0102bf351.jpeg', '380966223389', true, true, true, false, false, true, false, false, 'https://facebook.com/stephaniemedina', 'https://linkedin.com/in/patrick29', NULL, '4a1f5748', true, false, '2025-08-17 13:36:58.149503+02', '2025-08-17 13:36:58.149503+02');
INSERT INTO public.users VALUES (16, 'Cynthia Clark', 'moralescynthia@palmer-hughes.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Short yet that indeed alone catch wrong name real right vote exist seven.', 'users/ffece25a7e4698f2948a.jpeg', NULL, false, true, true, false, false, true, false, false, 'https://facebook.com/dcollins', 'https://linkedin.com/in/austinhensley', 'https://instagram.com/jonesdonald', '24453c49', true, false, '2025-08-17 13:03:01.2497+02', '2025-08-17 13:03:01.2497+02');
INSERT INTO public.users VALUES (4, 'Hannah Ibarra', 'scott54@yahoo.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Blood management read likely together speech impact teacher body result prove purpose.', 'users/68816c15fb574b0df067.jpeg', '380961234326', true, true, true, false, true, true, false, false, 'https://facebook.com/deborahcampos', 'https://linkedin.com/in/john32', 'https://instagram.com/zbailey', '6b5ea5c5', true, false, '2025-08-17 12:38:05.882227+02', '2025-08-17 12:38:05.882227+02');
INSERT INTO public.users VALUES (32, 'Deborah Davis', 'hancocktony@gmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Night both meeting skin business after here sure.', 'users/f28d67a01fc09ecb36e6.jpeg', '380666224658', true, true, true, false, false, true, false, false, 'https://facebook.com/kathyfernandez', 'https://linkedin.com/in/cassandra73', 'https://instagram.com/david07', 'b971c8be', true, false, '2025-08-17 13:45:50.074723+02', '2025-08-17 13:45:50.074723+02');
INSERT INTO public.users VALUES (31, 'Jennifer Smith', 'zimmermankevin@garcia.info', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Beat attack recently network boy film pattern party story hotel key.', 'users/731a2a5fbdb58fb1937b.jpeg', '380669263432', true, true, true, false, false, true, false, false, 'https://facebook.com/ricky31', 'https://linkedin.com/in/hilljames', 'https://instagram.com/courtneyprice', 'd201aa8c', true, false, '2025-08-17 13:44:19.945379+02', '2025-08-17 13:44:19.945379+02');
INSERT INTO public.users VALUES (30, 'Michael Mckinney', 'fberry@stout.net', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Particularly policy model hope section power modern training new station claim have.', 'users/c6ff1fd27f4bf6c137d8.jpeg', '380675611157', true, true, true, false, false, true, false, false, 'https://facebook.com/kandersen', 'https://linkedin.com/in/rebeccamcintosh', 'https://instagram.com/alexandercastillo', 'd4593834', true, false, '2025-08-17 13:42:16.512941+02', '2025-08-17 13:42:16.512941+02');
INSERT INTO public.users VALUES (29, 'David Harrell', 'gregorycox@hotmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Page man us political surface meeting break hotel enough game up authority.', 'users/2c682d81c6be661adcff.jpeg', NULL, false, true, true, false, false, true, false, false, 'https://facebook.com/markbrown', 'https://linkedin.com/in/robertgonzales', 'https://instagram.com/emoore', '763b83f4', true, false, '2025-08-17 13:40:03.754292+02', '2025-08-17 13:40:03.754292+02');
INSERT INTO public.users VALUES (28, 'Tommy Kim', 'allenbeard@morris.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Top series wind plant by become prevent check until peace risk item.', 'users/0d10f8a2e862bc90296e.jpeg', '380664408548', true, true, true, false, false, true, false, false, 'https://facebook.com/andreafisher', 'https://linkedin.com/in/scott46', 'https://instagram.com/vholt', 'de8fdb4d', true, false, '2025-08-17 13:39:01.892744+02', '2025-08-17 13:39:01.892744+02');
INSERT INTO public.users VALUES (22, 'Rebecca Hurley', 'qramirez@andrews-jackson.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Whom tell note see significant political people situation Mr road.', 'users/0acd5224ec51ae1097b9.jpeg', '380664559269', true, true, true, false, false, true, false, false, NULL, 'https://linkedin.com/in/logangarrett', 'https://instagram.com/juliaparks', '1442241f', true, false, '2025-08-17 13:13:40.027491+02', '2025-08-17 13:13:40.027491+02');
INSERT INTO public.users VALUES (1, 'admin', 'admin@gmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'admin', NULL, 'users/239a8c8eead7508bcbfb.png', '380678811196', false, false, true, false, true, true, false, false, NULL, NULL, NULL, '08cddc3c', true, false, '2025-07-13 13:52:02.659479+02', '2025-07-13 13:52:02.659479+02');
INSERT INTO public.users VALUES (3, 'Holly Burgess', 'catherine30@wright.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Thank return nothing officer adult car air wide hot.', 'users/e444d22dc4b670687ffb.jpeg', '380676186186', false, false, true, false, true, true, false, false, 'https://facebook.com/samuelbarron', 'https://linkedin.com/in/lopezharold', 'https://instagram.com/lucassusan', '08cddc3c', true, false, '2025-08-17 12:22:19.271814+02', '2025-08-17 12:22:19.271814+02');
INSERT INTO public.users VALUES (11, 'Tanya Clayton', 'monteslindsay@wyatt.biz', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Difficult four ok guy material of try.', 'users/b5f330a2f094974c46a4.jpeg', '380676436013', true, true, true, false, false, true, false, false, 'https://facebook.com/ahardy', 'https://linkedin.com/in/qdaniels', 'https://instagram.com/howardchris', 'd505e1a4', true, false, '2025-08-17 12:54:13.376729+02', '2025-08-17 12:54:13.376729+02');


--
-- TOC entry 5273 (class 0 OID 0)
-- Dependencies: 273
-- Name: active_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.active_actions_id_seq', 1, false);


--
-- TOC entry 5274 (class 0 OID 0)
-- Dependencies: 269
-- Name: chat_messages_contents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_messages_contents_id_seq', 341, true);


--
-- TOC entry 5275 (class 0 OID 0)
-- Dependencies: 267
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 341, true);


--
-- TOC entry 5276 (class 0 OID 0)
-- Dependencies: 265
-- Name: chat_relations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_relations_id_seq', 162, true);


--
-- TOC entry 5277 (class 0 OID 0)
-- Dependencies: 263
-- Name: chats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chats_id_seq', 111, true);


--
-- TOC entry 5278 (class 0 OID 0)
-- Dependencies: 279
-- Name: dispute_prediction_models_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.dispute_prediction_models_id_seq', 7, true);


--
-- TOC entry 5279 (class 0 OID 0)
-- Dependencies: 261
-- Name: disputes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.disputes_id_seq', 30, true);


--
-- TOC entry 5280 (class 0 OID 0)
-- Dependencies: 221
-- Name: email_verified_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.email_verified_codes_id_seq', 2, true);


--
-- TOC entry 5281 (class 0 OID 0)
-- Dependencies: 215
-- Name: knex_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.knex_migrations_id_seq', 36, true);


--
-- TOC entry 5282 (class 0 OID 0)
-- Dependencies: 217
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.knex_migrations_lock_index_seq', 1, true);


--
-- TOC entry 5283 (class 0 OID 0)
-- Dependencies: 247
-- Name: listing_approval_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.listing_approval_requests_id_seq', 1, true);


--
-- TOC entry 5284 (class 0 OID 0)
-- Dependencies: 241
-- Name: listing_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.listing_categories_id_seq', 37, true);


--
-- TOC entry 5285 (class 0 OID 0)
-- Dependencies: 249
-- Name: listing_category_create_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.listing_category_create_notifications_id_seq', 1, false);


--
-- TOC entry 5286 (class 0 OID 0)
-- Dependencies: 245
-- Name: listing_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.listing_images_id_seq', 249, true);


--
-- TOC entry 5287 (class 0 OID 0)
-- Dependencies: 239
-- Name: listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.listings_id_seq', 51, true);


--
-- TOC entry 5288 (class 0 OID 0)
-- Dependencies: 231
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.logs_id_seq', 42, true);


--
-- TOC entry 5289 (class 0 OID 0)
-- Dependencies: 253
-- Name: order_update_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_update_requests_id_seq', 29, true);


--
-- TOC entry 5290 (class 0 OID 0)
-- Dependencies: 251
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 51, true);


--
-- TOC entry 5291 (class 0 OID 0)
-- Dependencies: 277
-- Name: owner_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.owner_comments_id_seq', 1, true);


--
-- TOC entry 5292 (class 0 OID 0)
-- Dependencies: 223
-- Name: phone_verified_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.phone_verified_codes_id_seq', 1, false);


--
-- TOC entry 5293 (class 0 OID 0)
-- Dependencies: 257
-- Name: recipient_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipient_payments_id_seq', 1, false);


--
-- TOC entry 5294 (class 0 OID 0)
-- Dependencies: 275
-- Name: renter_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.renter_comments_id_seq', 2, true);


--
-- TOC entry 5295 (class 0 OID 0)
-- Dependencies: 243
-- Name: searched_words_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.searched_words_id_seq', 1, false);


--
-- TOC entry 5296 (class 0 OID 0)
-- Dependencies: 227
-- Name: seeds_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.seeds_status_id_seq', 4, true);


--
-- TOC entry 5297 (class 0 OID 0)
-- Dependencies: 255
-- Name: sender_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sender_payments_id_seq', 55, true);


--
-- TOC entry 5298 (class 0 OID 0)
-- Dependencies: 271
-- Name: sockets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sockets_id_seq', 1815, true);


--
-- TOC entry 5299 (class 0 OID 0)
-- Dependencies: 237
-- Name: system_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.system_id_seq', 10, true);


--
-- TOC entry 5300 (class 0 OID 0)
-- Dependencies: 281
-- Name: temp_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.temp_orders_id_seq', 138, true);


--
-- TOC entry 5301 (class 0 OID 0)
-- Dependencies: 225
-- Name: two_factor_auth_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.two_factor_auth_codes_id_seq', 1, false);


--
-- TOC entry 5302 (class 0 OID 0)
-- Dependencies: 229
-- Name: user_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_documents_id_seq', 1, false);


--
-- TOC entry 5303 (class 0 OID 0)
-- Dependencies: 235
-- Name: user_event_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_event_logs_id_seq', 86, true);


--
-- TOC entry 5304 (class 0 OID 0)
-- Dependencies: 259
-- Name: user_listing_favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_listing_favorites_id_seq', 1, false);


--
-- TOC entry 5305 (class 0 OID 0)
-- Dependencies: 233
-- Name: user_verify_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_verify_requests_id_seq', 1, false);


--
-- TOC entry 5306 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 32, true);


--
-- TOC entry 4979 (class 2606 OID 962476)
-- Name: active_actions active_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_actions
    ADD CONSTRAINT active_actions_pkey PRIMARY KEY (id);


--
-- TOC entry 4975 (class 2606 OID 962446)
-- Name: chat_messages_contents chat_messages_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages_contents
    ADD CONSTRAINT chat_messages_contents_pkey PRIMARY KEY (id);


--
-- TOC entry 4973 (class 2606 OID 962425)
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4971 (class 2606 OID 962404)
-- Name: chat_relations chat_relations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_relations
    ADD CONSTRAINT chat_relations_pkey PRIMARY KEY (id);


--
-- TOC entry 4969 (class 2606 OID 962394)
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- TOC entry 4985 (class 2606 OID 962540)
-- Name: dispute_prediction_models dispute_prediction_models_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dispute_prediction_models
    ADD CONSTRAINT dispute_prediction_models_pkey PRIMARY KEY (id);


--
-- TOC entry 4965 (class 2606 OID 962378)
-- Name: disputes disputes_order_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT disputes_order_id_unique UNIQUE (order_id);


--
-- TOC entry 4967 (class 2606 OID 962371)
-- Name: disputes disputes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT disputes_pkey PRIMARY KEY (id);


--
-- TOC entry 4925 (class 2606 OID 962028)
-- Name: email_verified_codes email_verified_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verified_codes
    ADD CONSTRAINT email_verified_codes_pkey PRIMARY KEY (id);


--
-- TOC entry 4919 (class 2606 OID 961991)
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- TOC entry 4917 (class 2606 OID 961984)
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4951 (class 2606 OID 962230)
-- Name: listing_approval_requests listing_approval_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_approval_requests
    ADD CONSTRAINT listing_approval_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4945 (class 2606 OID 962184)
-- Name: listing_categories listing_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_categories
    ADD CONSTRAINT listing_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4953 (class 2606 OID 962247)
-- Name: listing_category_create_notifications listing_category_create_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_category_create_notifications
    ADD CONSTRAINT listing_category_create_notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4949 (class 2606 OID 962214)
-- Name: listing_images listing_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_images
    ADD CONSTRAINT listing_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4943 (class 2606 OID 962166)
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- TOC entry 4935 (class 2606 OID 962108)
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4957 (class 2606 OID 962284)
-- Name: order_update_requests order_update_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_update_requests
    ADD CONSTRAINT order_update_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4955 (class 2606 OID 962264)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4983 (class 2606 OID 962512)
-- Name: owner_comments owner_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owner_comments
    ADD CONSTRAINT owner_comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4927 (class 2606 OID 962042)
-- Name: phone_verified_codes phone_verified_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phone_verified_codes
    ADD CONSTRAINT phone_verified_codes_pkey PRIMARY KEY (id);


--
-- TOC entry 4961 (class 2606 OID 962331)
-- Name: recipient_payments recipient_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipient_payments
    ADD CONSTRAINT recipient_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 962494)
-- Name: renter_comments renter_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.renter_comments
    ADD CONSTRAINT renter_comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4947 (class 2606 OID 962200)
-- Name: searched_words searched_words_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.searched_words
    ADD CONSTRAINT searched_words_pkey PRIMARY KEY (id);


--
-- TOC entry 4931 (class 2606 OID 962074)
-- Name: seeds_status seeds_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seeds_status
    ADD CONSTRAINT seeds_status_pkey PRIMARY KEY (seed_name);


--
-- TOC entry 4959 (class 2606 OID 962310)
-- Name: sender_payments sender_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sender_payments
    ADD CONSTRAINT sender_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4977 (class 2606 OID 962462)
-- Name: sockets sockets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sockets
    ADD CONSTRAINT sockets_pkey PRIMARY KEY (id);


--
-- TOC entry 4941 (class 2606 OID 962151)
-- Name: system system_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system
    ADD CONSTRAINT system_pkey PRIMARY KEY (id);


--
-- TOC entry 4987 (class 2606 OID 989320)
-- Name: temp_orders temp_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.temp_orders
    ADD CONSTRAINT temp_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4929 (class 2606 OID 962059)
-- Name: two_factor_auth_codes two_factor_auth_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.two_factor_auth_codes
    ADD CONSTRAINT two_factor_auth_codes_pkey PRIMARY KEY (id);


--
-- TOC entry 4933 (class 2606 OID 962088)
-- Name: user_documents user_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_documents
    ADD CONSTRAINT user_documents_pkey PRIMARY KEY (id);


--
-- TOC entry 4939 (class 2606 OID 962137)
-- Name: user_event_logs user_event_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_event_logs
    ADD CONSTRAINT user_event_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4963 (class 2606 OID 962350)
-- Name: user_listing_favorites user_listing_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_listing_favorites
    ADD CONSTRAINT user_listing_favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 4937 (class 2606 OID 962121)
-- Name: user_verify_requests user_verify_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_verify_requests
    ADD CONSTRAINT user_verify_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4921 (class 2606 OID 962019)
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- TOC entry 4923 (class 2606 OID 962017)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5018 (class 2606 OID 962477)
-- Name: active_actions active_actions_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_actions
    ADD CONSTRAINT active_actions_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.orders(id);


--
-- TOC entry 5014 (class 2606 OID 962426)
-- Name: chat_messages chat_messages_chat_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_chat_id_foreign FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- TOC entry 5016 (class 2606 OID 962447)
-- Name: chat_messages_contents chat_messages_contents_message_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages_contents
    ADD CONSTRAINT chat_messages_contents_message_id_foreign FOREIGN KEY (message_id) REFERENCES public.chat_messages(id);


--
-- TOC entry 5015 (class 2606 OID 962431)
-- Name: chat_messages chat_messages_sender_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_sender_id_foreign FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- TOC entry 5012 (class 2606 OID 962405)
-- Name: chat_relations chat_relations_chat_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_relations
    ADD CONSTRAINT chat_relations_chat_id_foreign FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- TOC entry 5013 (class 2606 OID 962410)
-- Name: chat_relations chat_relations_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_relations
    ADD CONSTRAINT chat_relations_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5010 (class 2606 OID 962372)
-- Name: disputes disputes_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT disputes_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 5011 (class 2606 OID 962379)
-- Name: disputes disputes_sender_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT disputes_sender_id_foreign FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- TOC entry 4988 (class 2606 OID 962029)
-- Name: email_verified_codes email_verified_codes_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verified_codes
    ADD CONSTRAINT email_verified_codes_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4998 (class 2606 OID 962231)
-- Name: listing_approval_requests listing_approval_requests_listing_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_approval_requests
    ADD CONSTRAINT listing_approval_requests_listing_id_foreign FOREIGN KEY (listing_id) REFERENCES public.listings(id);


--
-- TOC entry 4995 (class 2606 OID 962185)
-- Name: listing_categories listing_categories_parent_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_categories
    ADD CONSTRAINT listing_categories_parent_id_foreign FOREIGN KEY (parent_id) REFERENCES public.listing_categories(id);


--
-- TOC entry 4999 (class 2606 OID 962248)
-- Name: listing_category_create_notifications listing_category_create_notifications_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_category_create_notifications
    ADD CONSTRAINT listing_category_create_notifications_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4997 (class 2606 OID 962215)
-- Name: listing_images listing_images_listing_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_images
    ADD CONSTRAINT listing_images_listing_id_foreign FOREIGN KEY (listing_id) REFERENCES public.listings(id);


--
-- TOC entry 4994 (class 2606 OID 962167)
-- Name: listings listings_owner_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_owner_id_foreign FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- TOC entry 5002 (class 2606 OID 962290)
-- Name: order_update_requests order_update_requests_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_update_requests
    ADD CONSTRAINT order_update_requests_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 5003 (class 2606 OID 962285)
-- Name: order_update_requests order_update_requests_sender_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_update_requests
    ADD CONSTRAINT order_update_requests_sender_id_foreign FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- TOC entry 5000 (class 2606 OID 962270)
-- Name: orders orders_listing_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_listing_id_foreign FOREIGN KEY (listing_id) REFERENCES public.listings(id);


--
-- TOC entry 5001 (class 2606 OID 962265)
-- Name: orders orders_renter_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_renter_id_foreign FOREIGN KEY (renter_id) REFERENCES public.users(id);


--
-- TOC entry 5020 (class 2606 OID 962513)
-- Name: owner_comments owner_comments_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owner_comments
    ADD CONSTRAINT owner_comments_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4989 (class 2606 OID 962043)
-- Name: phone_verified_codes phone_verified_codes_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phone_verified_codes
    ADD CONSTRAINT phone_verified_codes_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5006 (class 2606 OID 962337)
-- Name: recipient_payments recipient_payments_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipient_payments
    ADD CONSTRAINT recipient_payments_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 5007 (class 2606 OID 962332)
-- Name: recipient_payments recipient_payments_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipient_payments
    ADD CONSTRAINT recipient_payments_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5019 (class 2606 OID 962495)
-- Name: renter_comments renter_comments_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.renter_comments
    ADD CONSTRAINT renter_comments_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4996 (class 2606 OID 962201)
-- Name: searched_words searched_words_listing_categories_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.searched_words
    ADD CONSTRAINT searched_words_listing_categories_id_foreign FOREIGN KEY (listing_categories_id) REFERENCES public.listing_categories(id);


--
-- TOC entry 5004 (class 2606 OID 962316)
-- Name: sender_payments sender_payments_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sender_payments
    ADD CONSTRAINT sender_payments_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 5005 (class 2606 OID 962311)
-- Name: sender_payments sender_payments_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sender_payments
    ADD CONSTRAINT sender_payments_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5017 (class 2606 OID 962463)
-- Name: sockets sockets_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sockets
    ADD CONSTRAINT sockets_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5021 (class 2606 OID 989326)
-- Name: temp_orders temp_orders_listing_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.temp_orders
    ADD CONSTRAINT temp_orders_listing_id_foreign FOREIGN KEY (listing_id) REFERENCES public.listings(id);


--
-- TOC entry 5022 (class 2606 OID 989321)
-- Name: temp_orders temp_orders_renter_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.temp_orders
    ADD CONSTRAINT temp_orders_renter_id_foreign FOREIGN KEY (renter_id) REFERENCES public.users(id);


--
-- TOC entry 4990 (class 2606 OID 962060)
-- Name: two_factor_auth_codes two_factor_auth_codes_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.two_factor_auth_codes
    ADD CONSTRAINT two_factor_auth_codes_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4991 (class 2606 OID 962089)
-- Name: user_documents user_documents_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_documents
    ADD CONSTRAINT user_documents_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4993 (class 2606 OID 962138)
-- Name: user_event_logs user_event_logs_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_event_logs
    ADD CONSTRAINT user_event_logs_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5008 (class 2606 OID 962351)
-- Name: user_listing_favorites user_listing_favorites_listing_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_listing_favorites
    ADD CONSTRAINT user_listing_favorites_listing_id_foreign FOREIGN KEY (listing_id) REFERENCES public.listings(id);


--
-- TOC entry 5009 (class 2606 OID 962356)
-- Name: user_listing_favorites user_listing_favorites_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_listing_favorites
    ADD CONSTRAINT user_listing_favorites_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4992 (class 2606 OID 962122)
-- Name: user_verify_requests user_verify_requests_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_verify_requests
    ADD CONSTRAINT user_verify_requests_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2025-08-19 20:42:27

--
-- PostgreSQL database dump complete
--

