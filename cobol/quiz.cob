       ID DIVISION.
       PROGRAM-ID. QUIZ-VALIDATOR.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-ARGUMENTS          PIC X(21).
       01 WS-RESPOSTAS          PIC X(10).
       01 WS-GABARITO           PIC X(10).
       01 WS-IDX                PIC 9(02) VALUE 1.
       01 WS-SCORE              PIC 9(03) VALUE 0.
       01 WS-DISP-QNUM          PIC 9(02).
       01 WS-CHAR-RESP          PIC X(01).
       01 WS-CHAR-GAB           PIC X(01).

       PROCEDURE DIVISION.
       MAIN-PROCEDURE.
      * Captura o argumento de 21 caracteres enviado pelo Node.js
           ACCEPT WS-ARGUMENTS FROM COMMAND-LINE.

      * Divide a string no espaco (10 respostas + espaco + 10 gabarito)
           UNSTRING WS-ARGUMENTS DELIMITED BY SPACE
              INTO WS-RESPOSTAS
                   WS-GABARITO.

      * Imprime o cabecalho para o Node.js fazer o parse
           DISPLAY "RESPOSTAS: " WS-RESPOSTAS.
           DISPLAY "GABARITO: " WS-GABARITO.

      * Loop pelas 10 respostas
           PERFORM VARYING WS-IDX FROM 1 BY 1 UNTIL WS-IDX > 10
               MOVE WS-RESPOSTAS(WS-IDX:1) TO WS-CHAR-RESP
               MOVE WS-GABARITO(WS-IDX:1) TO WS-CHAR-GAB
               MOVE WS-IDX TO WS-DISP-QNUM
               
      * Compara as alternativas e soma 10 pontos por acerto
               IF WS-CHAR-RESP = WS-CHAR-GAB THEN
                   ADD 10 TO WS-SCORE
                   DISPLAY "Q" WS-DISP-QNUM ": CERTO"
               ELSE
                   DISPLAY "Q" WS-DISP-QNUM ": ERRADO"
               END-IF
           END-PERFORM.

      * Imprime a pontuacao final de 0 a 100
           DISPLAY "PONTUACAO: " WS-SCORE.

      * Classificacao final
           EVALUATE WS-SCORE
               WHEN 100
                   DISPLAY "RESULTADO: PERFEITO"
               WHEN 70 THRU 90
                   DISPLAY "RESULTADO: MUITO BOM"
               WHEN 50 THRU 60
                   DISPLAY "RESULTADO: NA MEDIA"
               WHEN OTHER
                   DISPLAY "RESULTADO: PRECISA MELHORAR"
           END-EVALUATE.

           STOP RUN.
   