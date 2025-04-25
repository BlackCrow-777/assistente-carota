// difesa.js

// Variabili per la protezione
let followCount = 0;
let followLimit = 15; // Limite di follow sospetti
let followWindow = 30000; // 30 secondi
let modalitaProtezione = false; // Modalità protezione inizialmente disattivata

// Funzione per attivare la modalità protezione e la modalità follower-only (min 30 minuti)
function attivaModalitaProtezione(client) {
    modalitaProtezione = true;
    console.log("Modalità protezione attivata automaticamente.");

    // Attiva la modalità follower-only per 30 minuti
    attivaModalitaFollowerOnly(client, 30);

    client.say('#bunnyhime_', "Rilevato un attacco bot. Modalità protezione attivata. Solo chi segue da almeno 30 minuti può scrivere in chat.");
}

// Funzione per disattivare la modalità protezione e la modalità follower-only
function disattivaModalitaProtezione(client) {
    modalitaProtezione = false;
    console.log("Modalità protezione disattivata.");

    // Disattiva la modalità follower-only
    disattivaModalitaFollowerOnly(client);

    client.say('#bunnyhime_', "Modalità protezione disattivata. Restrizioni di chat rimosse.");
}

// Funzione per attivare la modalità follower-only per un minimo di 30 minuti
function attivaModalitaFollowerOnly(client, durataMinuti = 30) {
    client.say('#bunnyhime_', `/followers ${durataMinuti}m`)  // Imposta la modalità solo follower per 30 minuti
        .then(() => {
            console.log(`Modalità follower-only attivata per chi segue da almeno ${durataMinuti} minuti.`);
        })
        .catch(err => {
            console.error("Errore nell'attivare la modalità follower-only:", err);
        });
}

// Funzione per disattivare la modalità follower-only
function disattivaModalitaFollowerOnly(client) {
    client.say('#bunnyhime_', '/followersoff')  // Disabilita la modalità follower-only
        .then(() => {
            console.log("Modalità follower-only disattivata.");
        })
        .catch(err => {
            console.error("Errore nel disattivare la modalità follower-only:", err);
        });
}

// Monitorare i follow per rilevare un attacco bot
function monitorFollow(client, username) {
    followCount++;

    if (followCount > followLimit && !modalitaProtezione) {
        attivaModalitaProtezione(client);
    }

    // Resetta il conteggio dei follow dopo 30 secondi
    setTimeout(() => {
        followCount = 0;
    }, followWindow);
}

// Bannare automaticamente chi si iscrive durante la modalità protezione
function difesaAttaccoBot(client, username, motivo) {
    client.ban('#bunnyhime_', username, motivo)
        .then(() => {
            // Loggiamo solo nella console o in un file, senza intasare la chat
            console.log(`${username} è stato bannato per: ${motivo}`);
        })
        .catch(err => {
            console.error(`Errore nel bannare ${username}:`, err);
        });
}

// Esportazione delle funzioni di difesa
module.exports = {
    attivaModalitaProtezione,
    disattivaModalitaProtezione,
    monitorFollow,
    difesaAttaccoBot
};
