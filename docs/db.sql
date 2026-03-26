-- =========================================
-- TABELA: gam_turmas
-- =========================================
CREATE TABLE public.gam_turmas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(30),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT gam_turmas_nome_unique UNIQUE (nome),
    CONSTRAINT gam_turmas_codigo_unique UNIQUE (codigo)
);


-- =========================================
-- TABELA: gam_categorias
-- =========================================
CREATE TABLE public.gam_categorias (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT gam_categorias_nome_unique UNIQUE (nome)
);


-- =========================================
-- TABELA: gam_usuarios
-- Perfil interno do sistema, vinculado opcionalmente ao auth.users
-- =========================================
CREATE TABLE public.gam_usuarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    auth_user_id UUID UNIQUE,
    nome VARCHAR(150) NOT NULL,
    matricula VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    turma_id BIGINT,
    tipo VARCHAR(20) NOT NULL DEFAULT 'aluno',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_login_em TIMESTAMPTZ,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT gam_usuarios_auth_user_id_fkey
        FOREIGN KEY (auth_user_id)
        REFERENCES auth.users (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT gam_usuarios_matricula_unique UNIQUE (matricula),
    CONSTRAINT gam_usuarios_email_unique UNIQUE (email),

    CONSTRAINT gam_usuarios_turma_id_fkey
        FOREIGN KEY (turma_id)
        REFERENCES public.gam_turmas (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT gam_usuarios_tipo_check
        CHECK (tipo IN ('aluno', 'professor', 'admin'))
);


-- =========================================
-- TABELA: gam_desafios
-- Catálogo de desafios disponíveis
-- =========================================
CREATE TABLE public.gam_desafios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    pontos INTEGER NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    categoria_id BIGINT,

    limitacao_tipo VARCHAR(20) NOT NULL DEFAULT 'livre',
    limitacao_quantidade INTEGER,
    limitacao_intervalo_dias INTEGER,

    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT gam_desafios_categoria_id_fkey
        FOREIGN KEY (categoria_id)
        REFERENCES public.gam_categorias (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT gam_desafios_pontos_check
        CHECK (pontos >= 0),

    CONSTRAINT gam_desafios_limitacao_tipo_check
        CHECK (limitacao_tipo IN ('livre', 'unica', 'limitada', 'intervalada')),

    CONSTRAINT gam_desafios_limitacao_quantidade_check
        CHECK (
            limitacao_quantidade IS NULL OR limitacao_quantidade > 0
        ),

    CONSTRAINT gam_desafios_limitacao_intervalo_dias_check
        CHECK (
            limitacao_intervalo_dias IS NULL OR limitacao_intervalo_dias > 0
        )
);


-- =========================================
-- TABELA: gam_conquistas
-- Registros de desafios realizados por alunos
-- =========================================
CREATE TABLE public.gam_conquistas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    aluno_id BIGINT NOT NULL,
    desafio_id BIGINT NOT NULL,
    data_realizacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    pontos_obtidos INTEGER NOT NULL,
    observacao TEXT,
    registrado_por BIGINT,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT gam_conquistas_aluno_id_fkey
        FOREIGN KEY (aluno_id)
        REFERENCES public.gam_usuarios (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT gam_conquistas_desafio_id_fkey
        FOREIGN KEY (desafio_id)
        REFERENCES public.gam_desafios (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT gam_conquistas_registrado_por_fkey
        FOREIGN KEY (registrado_por)
        REFERENCES public.gam_usuarios (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT gam_conquistas_pontos_obtidos_check
        CHECK (pontos_obtidos >= 0)
);


-- =========================================
-- ÍNDICES
-- =========================================
CREATE INDEX idx_gam_usuarios_auth_user_id
    ON public.gam_usuarios (auth_user_id);

CREATE INDEX idx_gam_usuarios_turma_id
    ON public.gam_usuarios (turma_id);

CREATE INDEX idx_gam_usuarios_tipo
    ON public.gam_usuarios (tipo);

CREATE INDEX idx_gam_desafios_categoria_id
    ON public.gam_desafios (categoria_id);

CREATE INDEX idx_gam_desafios_ativo
    ON public.gam_desafios (ativo);

CREATE INDEX idx_gam_conquistas_aluno_id
    ON public.gam_conquistas (aluno_id);

CREATE INDEX idx_gam_conquistas_desafio_id
    ON public.gam_conquistas (desafio_id);

CREATE INDEX idx_gam_conquistas_registrado_por
    ON public.gam_conquistas (registrado_por);

CREATE INDEX idx_gam_conquistas_data_realizacao
    ON public.gam_conquistas (data_realizacao);