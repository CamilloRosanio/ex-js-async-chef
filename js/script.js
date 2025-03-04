/***********************************************************************
# IL COMPLEANNO DELLO CHEF
***********************************************************************/


// Creo questa funzione per centralizzare le future fetch e compattare il codice, oltre che renderlo più ordinato.
async function fetchJson(url) {
    // Grazie all'ASYNC AWAIT, "response" in questo caso assume il valore della Promise, senza bisogno di specificare THEN o CATCH.
    const response = await fetch(url);
    const object = await response.json();
    // Il RETURN non è un OBJECT, ma una PROMISE.
    return object;

    // Non specifico il CATCH perchè voglio che l'ERROR si propaghi alla funzione superiore in cui verrà usata questa funzione centralizzata.
}



const getChefBirthday = async (id) => {

    // Dichiaro qui la variabile dove conterrò il risutato della prima fetch.
    let recipe;

    // Uso il TRY CATCH in questa funzione superiore, proprio perchè è qui che voglio INTERCETTARE il mio ERROR della fetch.
    try {
        recipe = await fetchJson(`https://dummyjson.com/recipes/${id}`);
        console.log('Ricetta:', recipe);
    } catch (error) {
        // Lancio l'ERROR personalizzato, che rispecchia i casi in cui ad esempio l'URL è sbagliato o in cui l'ID non esiste.
        throw new Error('Impossibile recuperare la ricetta con Id:', id);
    }

    if (recipe.message) {
        // Gestisco qui il caso di ERROR in cui non esista un elemento con quello specifico ID, ed interrompo il codice.
        // So per certo che esiste un ".message" perchè gli oggetti "ERROR" sono sempre formati da NAME + MESSAGE.
        throw new Error(recipe.message);
    }

    // Dichiaro qui la variabile dove conterrò il risutato della seconda fetch.
    let chef;

    // Gestisco, anche per lo chef, i vari casi di errore proprio come ho fatto sopra.
    try {
        chef = await fetchJson(`https://dummyjson.com/users/${recipe.userId}`);
        console.log('Chef:', chef);
    } catch (error) {
        throw new Error('Impossibile recuperare lo chef con Id:', recipe.userId);
    }

    if (chef.message) {
        throw new Error(chef.message);
    }

    // Il RETURN avviene solo nel caso in cui non ci siano errori.
    return chef.birthDate;
}




// IIFE ( immediately invoked function expression )
/* Invoco immediatamente la mia funzione per eseguire i fetch descritti sopra.
Utilizzo TRY CATCH perchè devo gestire gli errori personalizzati che lancio nella funzione sopra, quindi devo intercettarli. */

(async () => {
    try {
        const chefBirthday = await getChefBirthday(1);
        // Se tutto va bene, ottengo l'informazione che posso rutilizzare.
        console.log('Data di nascita dello Chef:', chefBirthday);
    } catch (error) {
        // Altrimenti intercetto l'errore.
        console.error(error);
    } finally {
        // Grazie al FINALLY, anche in caso di errore posso comunque eseguire il blocco di codice sotto.
        console.log('FINALLY: Fine operazione.')
    }
})();