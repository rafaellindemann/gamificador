-- =========================================
-- SEED: gam_turmas
-- =========================================
INSERT INTO public.gam_turmas (nome, codigo)
VALUES
    ('DESI 1ª Fase', 'T DESI 2026-1 N1');


-- =========================================
-- SEED: gam_categorias
-- =========================================
INSERT INTO public.gam_categorias (nome, descricao)
VALUES
    ('Avaliação Objetiva', 'Provas, quizzes e avaliações objetivas'),
    ('Avaliação Prática', 'Projetos, implementações e exercícios práticos'),
    ('Desafio', 'Desafios extras valendo pontos'),
    ('Biscoitagem', 'Postagens, divulgação e ações de engajamento'),
    ('Trampo', 'Entregas, atividades e tarefas diversas'),
    ('Games', 'Dinâmicas, competições e atividades gamificadas'),
    ('Diversos', 'Categoria coringa para usos gerais');


-- =========================================
-- SEED: gam_usuarios
-- =========================================
INSERT INTO public.gam_usuarios (nome, matricula, email, turma_id, tipo)
VALUES
    ('Rafael Lindemann', 'PROF001', 'rafael@escola.com', NULL, 'admin'),
    ('Professor Exemplo', 'PROF002', 'prof.exemplo@escola.com', NULL, 'professor'),

    ('Ana Silva', '2026001', 'ana.silva@aluno.com', 1, 'aluno'),
    ('Bruno Souza', '2026002', 'bruno.souza@aluno.com', 1, 'aluno'),
    ('Carla Lima', '2026003', 'carla.lima@aluno.com', 2, 'aluno'),
    ('Diego Alves', '2026004', 'diego.alves@aluno.com', 2, 'aluno'),
    ('Eva Martins', '2026005', 'eva.martins@aluno.com', 3, 'aluno');


-- =========================================
-- SEED: gam_desafios
-- categoria_id:
-- 1 Avaliação Objetiva
-- 2 Avaliação Prática
-- 3 Desafio
-- 4 Biscoitagem
-- 5 Trampo
-- 6 Games
-- 7 Diversos
-- =========================================
INSERT INTO public.gam_desafios (
    titulo,
    descricao,
    pontos,
    ativo,
    categoria_id,
    limitacao_tipo,
    limitacao_quantidade,
    limitacao_intervalo_dias
)
VALUES
    (
        'Acertou questão bônus em aula',
        'Pontos por acertar uma questão bônus proposta em sala',
        10,
        TRUE,
        10,
        'livre',
        NULL,
        NULL
    ),
    (
        'Entrega de exercício prático',
        'Entrega de atividade prática solicitada em aula',
        25,
        TRUE,
        10,
        'livre',
        NULL,
        NULL
    ),
    (
        'Participação em desafio relâmpago',
        'Participação e resolução de desafio rápido durante a aula',
        15,
        TRUE,
        10,
        'intervalada',
        NULL,
        1
    ),
    (
        'Divulgou o projeto da equipe',
        'Ação de divulgação do projeto em rede social ou apresentação',
        20,
        TRUE,
        10,
        'limitada',
        3,
        NULL
    ),
    (
        'Entrega da avaliação objetiva',
        'Realização de avaliação objetiva prevista no cronograma',
        50,
        TRUE,
        10,
        'unica',
        NULL,
        NULL
    ),
    (
        'Ajuda prestada a colega',
        'Reconhecimento por colaboração relevante com outro aluno',
        10,
        TRUE,
        10,
        'livre',
        NULL,
        NULL
    );


-- =========================================
-- SEED: gam_conquistas
-- aluno_id:
-- 3 Ana Silva
-- 4 Bruno Souza
-- 5 Carla Lima
-- 6 Diego Alves
-- 7 Eva Martins
--
-- desafio_id:
-- 1 Acertou questão bônus em aula
-- 2 Entrega de exercício prático
-- 3 Participação em desafio relâmpago
-- 4 Divulgou o projeto da equipe
-- 5 Entrega da avaliação objetiva
-- 6 Ajuda prestada a colega
--
-- registrado_por:
-- 1 Rafael Lindemann (admin)
-- 2 Professor Exemplo
-- =========================================
INSERT INTO public.gam_conquistas (
    aluno_id,
    desafio_id,
    data_realizacao,
    pontos_obtidos,
    observacao,
    registrado_por
)
VALUES
    (23, 7, NOW() - INTERVAL '10 days', 10, 'Acertou a questão bônus sobre variáveis', 22),
    (23, 8, NOW() - INTERVAL '8 days', 25, 'Entrega completa e correta', 22),
    (23, 9, NOW() - INTERVAL '2 days', 10, 'Ajudou colega durante exercício em dupla', 22),

    (24, 8, NOW() - INTERVAL '9 days', 25, 'Entrega da atividade prática', 22),
    (24, 9, NOW() - INTERVAL '3 days', 15, 'Bom desempenho no desafio relâmpago', 22),

    (25, 9, NOW() - INTERVAL '11 days', 10, 'Questão bônus respondida corretamente', 22),
    (25, 7, NOW() - INTERVAL '5 days', 20, 'Divulgou o projeto da equipe', 22),
    (25, 9, NOW() - INTERVAL '1 day', 50, 'Realizou a avaliação objetiva', 22),

    (26, 8, NOW() - INTERVAL '7 days', 25, 'Entrega parcial com bom resultado', 22),

    (27, 9, NOW() - INTERVAL '4 days', 15, 'Participou do game da aula', 22),
    (27, 7, NOW() - INTERVAL '1 day', 10, 'Ajudou na organização da equipe', 22);