CREATE DATABASE IF NOT EXISTS plataforma_numeros
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE plataforma_numeros;

-- ── Tabla: usuarios ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id             INT      NOT NULL AUTO_INCREMENT,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ── Tabla: lecciones ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lecciones (
  id          INT          NOT NULL AUTO_INCREMENT,
  numero      INT          NOT NULL,
  nombre      VARCHAR(150) NOT NULL,
  descripcion TEXT,
  PRIMARY KEY (id)
);

-- ── Tabla: actividades ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS actividades (
  id             INT          NOT NULL AUTO_INCREMENT,
  leccion_id     INT          NOT NULL,
  nombre         VARCHAR(200) NOT NULL,
  descripcion    TEXT,
  puntaje_maximo INT          NOT NULL DEFAULT 100,
  orden          INT          NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_actividad_leccion
    FOREIGN KEY (leccion_id) REFERENCES lecciones(id)
    ON DELETE CASCADE
);

-- ── Tabla: calificaciones ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS calificaciones (
  id               INT      NOT NULL AUTO_INCREMENT,
  usuario_id       INT      NOT NULL,
  actividad_id     INT      NOT NULL,
  puntaje_obtenido INT      NOT NULL DEFAULT 0,
  fecha            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuario_actividad (usuario_id, actividad_id),
  CONSTRAINT fk_calif_usuario
    FOREIGN KEY (usuario_id)   REFERENCES usuarios(id)   ON DELETE CASCADE,
  CONSTRAINT fk_calif_actividad
    FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE
);

-- ══════════════════════════════════════════════════════════════
--  DATOS SEMILLA
-- ══════════════════════════════════════════════════════════════

INSERT INTO lecciones (numero, nombre, descripcion) VALUES
(1, 'Conozcamos los números hasta 200',
    'Introducción a la centena, tabla de valores C-D-U y lectura de números de tres cifras hasta 200.'),
(2, 'Aprendamos sobre números de tres cifras y la unidad de millar',
    'Composición y descomposición de números de tres cifras. El número 1,000.'),
(3, 'Preparémonos para la suma y la resta',
    'Repaso de decenas y unidades. Formación de números con C, D y U. Series numéricas.'),
(4, 'Utilicemos la recta numérica con números de tres cifras',
    'Ubicación de números en la recta numérica con saltos de 1, 10 y 100.'),
(5, 'Comparemos números de tres cifras y conozcamos más números ordinales',
    'Signos < y > para comparar números. Ordinales del 10.° al 20.° (vigésimo).');

-- Lección 1
INSERT INTO actividades (leccion_id, nombre, descripcion, puntaje_maximo, orden) VALUES
(1, 'Analicemos el número 100',
    'Identifica que 100 unidades forman 1 centena y ubícalo en la tabla C-D-U.', 100, 1),
(1, 'Contemos, escribamos y leamos números de 100 en 100',
    'Forma y lee números de 100 en 100: 100, 200, 300... hasta 900.', 100, 2),
(1, 'Formemos números de tres cifras',
    'Compone números de tres cifras usando centenas, decenas y unidades.', 100, 3),
(1, 'Leamos y escribamos números de tres cifras',
    'Lee y escribe en letras números de tres cifras hasta 200.', 100, 4),
(1, 'Practiquemos lo aprendido — Lección 1',
    'Ejercicios de repaso de toda la lección 1.', 100, 5);

-- Lección 2
INSERT INTO actividades (leccion_id, nombre, descripcion, puntaje_maximo, orden) VALUES
(2, 'Contemos, escribamos y leamos números de 100 en 100',
    'Reconoce y escribe números de 100 en 100 hasta 900.', 100, 1),
(2, 'Compongamos y descompongamos números de tres cifras',
    'Descompone un número en centenas + decenas + unidades.', 100, 2),
(2, 'Descompongamos números de tres cifras de otra forma',
    'Descomposición alternativa: suma de valores posicionales.', 100, 3),
(2, 'La unidad de millar — el número 1,000',
    'Identifica que 10 centenas forman la unidad de millar (1,000).', 100, 4),
(2, 'Practiquemos lo aprendido — Lección 2',
    'Ejercicios de repaso de toda la lección 2.', 100, 5);

-- Lección 3
INSERT INTO actividades (leccion_id, nombre, descripcion, puntaje_maximo, orden) VALUES
(3, 'Formemos números de dos cifras',
    'Repaso: forma números de dos cifras con decenas y unidades.', 100, 1),
(3, 'Formemos números de tres cifras con C, D y U',
    'Forma números de tres cifras identificando cada posición.', 100, 2),
(3, 'Completemos series numéricas',
    'Completa series con patrones de +1, +10 y +100.', 100, 3),
(3, 'Practiquemos lo aprendido — Lección 3',
    'Ejercicios de repaso de toda la lección 3.', 100, 4);

-- Lección 4
INSERT INTO actividades (leccion_id, nombre, descripcion, puntaje_maximo, orden) VALUES
(4, 'Ubiquemos los números en la recta numérica',
    'Ubica números de tres cifras en la recta numérica contando de 1 en 1.', 100, 1),
(4, 'Completemos la recta numérica con saltos de 10',
    'Completa rectas numéricas avanzando de 10 en 10.', 100, 2),
(4, 'Completemos la recta numérica con saltos de 100',
    'Completa rectas numéricas avanzando de 100 en 100.', 100, 3),
(4, 'Practiquemos lo aprendido — Lección 4',
    'Ejercicios de repaso de toda la lección 4.', 100, 4);

-- Lección 5
INSERT INTO actividades (leccion_id, nombre, descripcion, puntaje_maximo, orden) VALUES
(5, 'Comparemos números usando la recta numérica',
    'Usa la recta numérica para determinar cuál número es mayor o menor.', 100, 1),
(5, 'Comparemos números con la tabla de valores — parte 1',
    'Compara centenas para determinar mayor o menor con < y >.', 100, 2),
(5, 'Comparemos números con la tabla de valores — parte 2',
    'Compara decenas y unidades cuando las centenas son iguales.', 100, 3),
(5, 'Conozcamos los números ordinales hasta el vigésimo',
    'Identifica y lee ordinales del 10.° (décimo) al 20.° (vigésimo).', 100, 4),
(5, 'Practiquemos lo aprendido — Lección 5',
    'Ejercicios de repaso de toda la lección 5 y de la unidad completa.', 100, 5);