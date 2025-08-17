--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2025-08-17 22:29:49

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


--
-- TOC entry 5221 (class 0 OID 962437)
-- Dependencies: 270
-- Data for Name: chat_messages_contents; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.chat_messages_contents VALUES (1, '{"listingName":"Men''s low-top sneakers Puma Rebound v6 Low 39232843 44","offerPrice":10,"listingPhotoType":"storage","listingPhotoPath":"listings/4dc3e136a36760f831bf.png","offerStartDate":"2025-08-10 00:00","offerFinishDate":"2025-08-14 00:00","description":"Hi, I want to rent sneakers to show off in front of a girl :)"}', '2025-08-10 12:44:29.653034+02', '2025-08-10 12:44:29.653034+02', 1);


--
-- TOC entry 5217 (class 0 OID 962396)
-- Dependencies: 266
-- Data for Name: chat_relations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.chat_relations VALUES (1, false, '2025-08-10 12:44:29.630466+02', '2025-08-10 12:44:29.630466+02', 1, 1);
INSERT INTO public.chat_relations VALUES (2, false, '2025-08-10 12:44:29.633241+02', '2025-08-10 12:44:29.633241+02', 1, 2);


--
-- TOC entry 5215 (class 0 OID 962385)
-- Dependencies: 264
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.chats VALUES (1, 1, 'order', 'Rental Men''s low-top sneakers Puma Rebound v6 Low 39232843 44', '2025-08-10 12:44:29.62742+02', '2025-08-10 12:44:29.62742+02');


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


--
-- TOC entry 5205 (class 0 OID 962276)
-- Dependencies: 254
-- Data for Name: order_update_requests; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5203 (class 0 OID 962254)
-- Dependencies: 252
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.orders VALUES (1, 'pending_owner', NULL, 10, '2025-08-09 23:00:00+02', '2025-08-13 23:00:00+02', NULL, NULL, NULL, 15, 15, NULL, '2025-08-10 12:44:29.612187+02', '2025-08-10 12:44:29.612187+02', 2, 1, 50);


--
-- TOC entry 5229 (class 0 OID 962501)
-- Dependencies: 278
-- Data for Name: owner_comments; Type: TABLE DATA; Schema: public; Owner: -
--



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

INSERT INTO public.users VALUES (9, 'Matthew Moss', 'lindaward@gibbs.net', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Everything best free piece fact future.', 'users/aa7eceb3a969aea6d367.jpeg', '380661256349', true, true, true, false, false, true, false, false, NULL, 'https://linkedin.com/in/lisaharrington', NULL, 'ad665ea9', true, false, '2025-08-17 12:48:50.219283+02', '2025-08-17 12:48:50.219283+02');
INSERT INTO public.users VALUES (7, 'Juan Wilson', 'mackpaul@hotmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Report tend thank deal major agent through.', 'users/3a4c96ef8066a42832ec.jpeg', '380964236558', true, true, true, false, true, true, false, false, 'https://facebook.com/mgardner', NULL, NULL, '93d3f49c', true, false, '2025-08-17 12:44:04.176978+02', '2025-08-17 12:44:04.176978+02');
INSERT INTO public.users VALUES (6, 'Carrie Thomas', 'theodorehenry@yahoo.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Author Republican why beautiful teacher which public enough maintain couple idea.', 'users/1de34bf9a9e7f5cce371.jpeg', '380674236558', true, true, true, false, true, true, false, false, 'https://facebook.com/taylorshawn', 'https://linkedin.com/in/ecollins', 'https://instagram.com/brett85', 'de1ac9a4', true, false, '2025-08-17 12:41:50.000354+02', '2025-08-17 12:41:50.000354+02');
INSERT INTO public.users VALUES (5, 'Erica Kim', 'emily50@delacruz.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'International door direction number every amount.', 'users/ba90478ddf8b7e720000.jpeg', '380662524418', true, true, true, false, true, true, false, false, NULL, NULL, NULL, 'd496f4bf', true, false, '2025-08-17 12:39:27.835984+02', '2025-08-17 12:39:27.835984+02');
INSERT INTO public.users VALUES (2, 'tester', 'test@gmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', '', '', NULL, false, true, false, false, true, true, false, false, NULL, NULL, NULL, NULL, true, false, '2025-08-10 12:05:02.914295+02', '2025-08-10 12:05:02.914295+02');
INSERT INTO public.users VALUES (4, 'Hannah Ibarra', 'scott54@yahoo.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Blood management read likely together speech impact teacher body result prove purpose.', 'users/68816c15fb574b0df067.jpeg', '380961234326', true, true, true, false, true, true, false, false, 'https://facebook.com/deborahcampos', 'https://linkedin.com/in/john32', 'https://instagram.com/zbailey', '6b5ea5c5', true, false, '2025-08-17 12:38:05.882227+02', '2025-08-17 12:38:05.882227+02');
INSERT INTO public.users VALUES (26, 'Taylor Decker', 'sarahgomez@schultz-lin.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Adult board experience decision technology message.', 'users/e719f33aacad8812de18.jpeg', NULL, false, true, true, false, false, true, false, false, 'https://facebook.com/logancurtis', NULL, NULL, 'eaee4327', true, false, '2025-08-17 13:35:39.829949+02', '2025-08-17 13:35:39.829949+02');
INSERT INTO public.users VALUES (3, 'Holly Burgess', 'catherine30@wright.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Thank return nothing officer adult car air wide hot.', 'users/e444d22dc4b670687ffb.jpeg', '380676186186', false, false, true, false, true, true, false, false, 'https://facebook.com/samuelbarron', 'https://linkedin.com/in/lopezharold', 'https://instagram.com/lucassusan', '08cddc3c', true, false, '2025-08-17 12:22:19.271814+02', '2025-08-17 12:22:19.271814+02');
INSERT INTO public.users VALUES (25, 'Tiffany Gray', 'taylorwebb@hodges.org', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Stock both decision set simply level nation available.', 'users/4b3ec2cc7eaf2a8baaf6.jpeg', '380661236842', true, true, true, false, false, true, false, false, 'https://facebook.com/gsanders', 'https://linkedin.com/in/epeterson', 'https://instagram.com/lynn99', 'c19e80b7', true, false, '2025-08-17 13:34:29.351501+02', '2025-08-17 13:34:29.351501+02');
INSERT INTO public.users VALUES (24, 'Jose Hobbs', 'riverabriana@yahoo.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Health hit form finally billion sound again better describe travel.', 'users/a6a22ffaee5b07d4954b.jpeg', '380667765081', true, true, true, false, false, true, false, false, 'https://facebook.com/scottgolden', 'https://linkedin.com/in/iromero', 'https://instagram.com/proctorrobert', 'fb7f6628', true, false, '2025-08-17 13:32:46.35461+02', '2025-08-17 13:32:46.35461+02');
INSERT INTO public.users VALUES (23, 'Dawn Wolfe', 'xbell@hotmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Forward and whether argue seem garden tough plan yeah bring.', 'users/ad10f2d6569054c335c6.jpeg', '380665434478', true, true, true, false, false, true, false, false, 'https://facebook.com/chapmanbeverly', 'https://linkedin.com/in/vbrown', NULL, '1b425272', true, false, '2025-08-17 13:31:19.347167+02', '2025-08-17 13:31:19.347167+02');
INSERT INTO public.users VALUES (21, 'Russell Humphrey', 'mlewis@cook.org', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Break difference card travel deal interview clearly girl who.', 'users/e392d8a41962b73a901d.jpeg', '380661239821', true, true, true, false, false, true, false, false, 'https://facebook.com/russellsmith', 'https://linkedin.com/in/brettkidd', NULL, '3759fdfb', true, false, '2025-08-17 13:11:27.091942+02', '2025-08-17 13:11:27.091942+02');
INSERT INTO public.users VALUES (20, 'Kelsey Rojas', 'baileyjoshua@pittman.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'More subject join reality issue lay type her ago.', 'users/ce6a6666a593cdf016a7.jpeg', NULL, false, true, true, false, false, true, false, false, 'https://facebook.com/tracythompson', 'https://linkedin.com/in/laura90', NULL, '108d38ad', true, false, '2025-08-17 13:09:40.968724+02', '2025-08-17 13:09:40.968724+02');
INSERT INTO public.users VALUES (19, 'Renee Branch', 'nicholas86@nixon.org', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Hundred affect her east single bed herself full mind true order.', 'users/cd303cc1ff9347e41682.jpeg', '380964222541', true, true, true, false, false, true, false, false, 'https://facebook.com/cooperrebecca', NULL, NULL, '6aa8aa6b', true, false, '2025-08-17 13:08:24.122889+02', '2025-08-17 13:08:24.122889+02');
INSERT INTO public.users VALUES (18, 'Crystal Morrow', 'jturner@thompson.biz', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Room mission business center ten letter goal begin year.', 'users/6ddc3f61ff9a233974f6.jpeg', '380676678246', true, true, true, false, false, true, false, false, 'https://facebook.com/handerson', 'https://linkedin.com/in/andrew32', 'https://instagram.com/knapprobert', '9973ecc1', true, false, '2025-08-17 13:06:46.641678+02', '2025-08-17 13:06:46.641678+02');
INSERT INTO public.users VALUES (17, 'Jodi Zimmerman', 'khartman@yahoo.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Structure model job fund Republican one determine.', 'users/037540811f9e699f4421.jpeg', '380662259015', true, true, true, false, false, true, false, false, NULL, NULL, NULL, 'f19ec452', true, false, '2025-08-17 13:04:08.698832+02', '2025-08-17 13:04:08.698832+02');
INSERT INTO public.users VALUES (15, 'Craig Dennis', 'brittanycook@gmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Call according responsibility huge contain successful million can important score.', 'users/35aa5950f8ca5025c285.jpeg', '380666584442', true, true, true, false, false, true, false, false, 'https://facebook.com/colerandall', NULL, 'https://instagram.com/qsanders', 'ae3e8107', true, false, '2025-08-17 13:01:47.474004+02', '2025-08-17 13:01:47.474004+02');
INSERT INTO public.users VALUES (14, 'Joseph Mccall', 'tinastephens@bates.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', NULL, 'users/dd15d7874803bae41171.jpeg', NULL, false, true, true, false, false, true, false, false, NULL, NULL, 'https://instagram.com/brenda56', '7c133bc0', true, false, '2025-08-17 12:58:46.68604+02', '2025-08-17 12:58:46.68604+02');
INSERT INTO public.users VALUES (13, 'Cheryl Keith', 'thomasanderson@aguilar.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Property everybody suffer process news best Democrat event how price site.', 'users/5b4707cbc062d1281eaa.jpeg', NULL, false, true, true, false, false, true, false, false, NULL, 'https://linkedin.com/in/nryan', NULL, 'kGVSRLhnA7to', true, false, '2025-08-17 12:57:30.810516+02', '2025-08-17 12:57:30.810516+02');
INSERT INTO public.users VALUES (12, 'Theresa Baker MD', 'emilyparsons@gmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Sound rock growth compare too general make which where.', 'users/e57042a3d89e54732137.jpeg', '380663253489', true, true, true, false, false, true, false, false, 'https://facebook.com/david28', NULL, NULL, 'a722e661', true, false, '2025-08-17 12:55:54.643181+02', '2025-08-17 12:55:54.643181+02');
INSERT INTO public.users VALUES (10, 'Sara Mueller', 'uglover@erickson-byrd.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Make character sport open sing take television specific management miss.', 'users/30bf463f04e10a72148f.jpeg', '380669271708', true, true, true, false, false, true, false, false, 'https://facebook.com/michaeljohnson', 'https://linkedin.com/in/perrysean', NULL, 'e9dc3319', true, false, '2025-08-17 12:51:32.43273+02', '2025-08-17 12:51:32.43273+02');
INSERT INTO public.users VALUES (8, 'Sandra Osborn', 'iharris@hotmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Product newspaper price nearly point Congress war different.', 'users/e91559bd3c0330fe5e9d.jpeg', '380666440342', true, true, true, false, false, true, false, false, NULL, 'https://linkedin.com/in/zfowler', 'https://instagram.com/nancy53', '5889b946', true, false, '2025-08-17 12:47:19.284473+02', '2025-08-17 12:47:19.284473+02');
INSERT INTO public.users VALUES (27, 'Monica Freeman', 'rcarter@yahoo.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Card course increase prove agency above become get social.', 'users/73be5ae8e2b0102bf351.jpeg', '380966223389', true, true, true, false, false, true, false, false, 'https://facebook.com/stephaniemedina', 'https://linkedin.com/in/patrick29', NULL, '4a1f5748', true, false, '2025-08-17 13:36:58.149503+02', '2025-08-17 13:36:58.149503+02');
INSERT INTO public.users VALUES (11, 'Tanya Clayton', 'monteslindsay@wyatt.biz', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Difficult four ok guy material of try.', 'users/b5f330a2f094974c46a4.jpeg', '380676436013', true, true, true, false, false, true, false, false, 'https://facebook.com/ahardy', 'https://linkedin.com/in/qdaniels', 'https://instagram.com/howardchris', 'd505e1a4', true, false, '2025-08-17 12:54:13.376729+02', '2025-08-17 12:54:13.376729+02');
INSERT INTO public.users VALUES (1, 'admin', 'admin@gmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'admin', NULL, 'users/239a8c8eead7508bcbfb.png', '380678811196', false, false, true, false, true, true, false, true, NULL, NULL, NULL, NULL, true, false, '2025-07-13 13:52:02.659479+02', '2025-07-13 13:52:02.659479+02');
INSERT INTO public.users VALUES (32, 'Deborah Davis', 'hancocktony@gmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Night both meeting skin business after here sure.', 'users/f28d67a01fc09ecb36e6.jpeg', '380666224658', true, true, true, false, false, true, false, false, 'https://facebook.com/kathyfernandez', 'https://linkedin.com/in/cassandra73', 'https://instagram.com/david07', 'b971c8be', true, false, '2025-08-17 13:45:50.074723+02', '2025-08-17 13:45:50.074723+02');
INSERT INTO public.users VALUES (31, 'Jennifer Smith', 'zimmermankevin@garcia.info', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Beat attack recently network boy film pattern party story hotel key.', 'users/731a2a5fbdb58fb1937b.jpeg', '380669263432', true, true, true, false, false, true, false, false, 'https://facebook.com/ricky31', 'https://linkedin.com/in/hilljames', 'https://instagram.com/courtneyprice', 'd201aa8c', true, false, '2025-08-17 13:44:19.945379+02', '2025-08-17 13:44:19.945379+02');
INSERT INTO public.users VALUES (30, 'Michael Mckinney', 'fberry@stout.net', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Particularly policy model hope section power modern training new station claim have.', 'users/c6ff1fd27f4bf6c137d8.jpeg', '380675611157', true, true, true, false, false, true, false, false, 'https://facebook.com/kandersen', 'https://linkedin.com/in/rebeccamcintosh', 'https://instagram.com/alexandercastillo', 'd4593834', true, false, '2025-08-17 13:42:16.512941+02', '2025-08-17 13:42:16.512941+02');
INSERT INTO public.users VALUES (29, 'David Harrell', 'gregorycox@hotmail.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Page man us political surface meeting break hotel enough game up authority.', 'users/2c682d81c6be661adcff.jpeg', NULL, false, true, true, false, false, true, false, false, 'https://facebook.com/markbrown', 'https://linkedin.com/in/robertgonzales', 'https://instagram.com/emoore', '763b83f4', true, false, '2025-08-17 13:40:03.754292+02', '2025-08-17 13:40:03.754292+02');
INSERT INTO public.users VALUES (28, 'Tommy Kim', 'allenbeard@morris.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Top series wind plant by become prevent check until peace risk item.', 'users/0d10f8a2e862bc90296e.jpeg', '380664408548', true, true, true, false, false, true, false, false, 'https://facebook.com/andreafisher', 'https://linkedin.com/in/scott46', 'https://instagram.com/vholt', 'de8fdb4d', true, false, '2025-08-17 13:39:01.892744+02', '2025-08-17 13:39:01.892744+02');
INSERT INTO public.users VALUES (22, 'Rebecca Hurley', 'qramirez@andrews-jackson.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Whom tell note see significant political people situation Mr road.', 'users/0acd5224ec51ae1097b9.jpeg', '380664559269', true, true, true, false, false, true, false, false, NULL, 'https://linkedin.com/in/logangarrett', 'https://instagram.com/juliaparks', '1442241f', true, false, '2025-08-17 13:13:40.027491+02', '2025-08-17 13:13:40.027491+02');
INSERT INTO public.users VALUES (16, 'Cynthia Clark', 'moralescynthia@palmer-hughes.com', true, '$2b$10$fTk379Jv2HQvFXKzMZyE5.7RfFTjiVVrMmu32Vz6r4aO9pCCsBosi', 'user', 'Short yet that indeed alone catch wrong name real right vote exist seven.', 'users/ffece25a7e4698f2948a.jpeg', NULL, false, true, true, false, false, true, false, false, 'https://facebook.com/dcollins', 'https://linkedin.com/in/austinhensley', 'https://instagram.com/jonesdonald', '24453c49', true, false, '2025-08-17 13:03:01.2497+02', '2025-08-17 13:03:01.2497+02');


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

SELECT pg_catalog.setval('public.chat_messages_contents_id_seq', 1, true);


--
-- TOC entry 5275 (class 0 OID 0)
-- Dependencies: 267
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 1, true);


--
-- TOC entry 5276 (class 0 OID 0)
-- Dependencies: 265
-- Name: chat_relations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_relations_id_seq', 2, true);


--
-- TOC entry 5277 (class 0 OID 0)
-- Dependencies: 263
-- Name: chats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chats_id_seq', 1, true);


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

SELECT pg_catalog.setval('public.disputes_id_seq', 1, false);


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

SELECT pg_catalog.setval('public.logs_id_seq', 39, true);


--
-- TOC entry 5289 (class 0 OID 0)
-- Dependencies: 253
-- Name: order_update_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_update_requests_id_seq', 1, false);


--
-- TOC entry 5290 (class 0 OID 0)
-- Dependencies: 251
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, true);


--
-- TOC entry 5291 (class 0 OID 0)
-- Dependencies: 277
-- Name: owner_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.owner_comments_id_seq', 1, false);


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

SELECT pg_catalog.setval('public.renter_comments_id_seq', 1, false);


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

SELECT pg_catalog.setval('public.sender_payments_id_seq', 1, false);


--
-- TOC entry 5298 (class 0 OID 0)
-- Dependencies: 271
-- Name: sockets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sockets_id_seq', 969, true);


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

SELECT pg_catalog.setval('public.temp_orders_id_seq', 17, true);


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


-- Completed on 2025-08-17 22:29:49

--
-- PostgreSQL database dump complete
--

