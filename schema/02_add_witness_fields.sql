-- Migration to add witness fields for sigil URL and status
-- Adds indexes on wallet_address and discord_id

ALTER TABLE public.witnesses
    ADD COLUMN sigil_url text,
    ADD COLUMN status text NOT NULL DEFAULT 'pending'::text;

COMMENT ON COLUMN public.witnesses.sigil_url IS 'URL of the witness''s sigil image.';
COMMENT ON COLUMN public.witnesses.status IS 'Current status of the witness record (e.g., pending, active, revoked).';

CREATE INDEX IF NOT EXISTS witnesses_wallet_address_idx ON public.witnesses (wallet_address);
CREATE INDEX IF NOT EXISTS witnesses_discord_id_idx ON public.witnesses (discord_id);

