//* CVZ 17 OCT 22 exos JBR */
//* version 17oct22 code refactorisé*/

// on récupère les informations de la page HTML

const button = document.querySelector('#clickme');      // bouton saisie de l'ID
const buttonDel = document.querySelector('#clickDel');  // bouton vider la page
const input = document.querySelector('#input');         // récupération de l'ID saisi

// balise div pour afficher les résultats, les retours de l'API avec requête sur ID
const div = document.querySelector('#displayResult');

// un paragraphe par valeur de texte affichée
const item = document.createElement('p');

// creation de l'objet image
const image = document.createElement('img');

 //detDim =  détail des dimensions
const detDim = document.createElement('p');

// listener sur le clic pour le bouton principal
button.addEventListener('click', (event) => {

    // on recupere la valeur saisie
    idArt = input.value;

    // on vérifie la valeur saisie
    const invalid =  isNaN(idArt); // la fonction isNaN teste "is NOT a number"
    console.log('saisie = ' + idArt);
    console.log(invalid); 

    if (invalid){
        console.log("erreur de saisie");
        alert("on attend un nombre");        // c'est ce qui fait la popup "valeur saisie incorrecte"
    } else{
        callOeuvreDetails(idArt);
    }
    
})

//listener sur le bouton delete
buttonDel.addEventListener('click', (event) => {
    cleanPage();
})

function cleanPage(){
    console.log("on vide la page");
    div.innerHTML = "";  // on affecte du code vide à la page HTML
}

function callOeuvreDetails(idOeuvre){
    // appel de l'API du MET
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${idOeuvre}`) 
        .then((Response) => Response.json())  //transfo de la réponse de l'API en json
        .then((data) => {
            console.log(data);
            createResult(data.title, data.primaryImageSmall, data.period, data.department, data.accessionYear, data.measurements);
        })
}
// ID OK :  546303  546300 34276 654 29950 3476
// ID sans images 9873 5872 546

function createResult(name, picture, period, department, accessionYear,measurements){
    cleanPage();    
    displayText(name, period, department, accessionYear);
    displayImage(picture,measurements);
    // on ajoute au parent [div] l'element enfant [item - p - ...] c'est le mode append qui fait ça
    div.appendChild(item);
    div.appendChild(image);
    /*div.removeChild(item);
    div.removeChild(image);  un élément ne se supprime pas tout seul. utiliser cette méthode pour supprimer le fils depuis le parent
    voir aussi parent.node avec remove.child    */ 
}

function displayText(name, period, department, accessionYear){
    // on ajoute du texte a l item. C'est l'attribut innerText
    item.innerText = `Il s'agit de ${name}, objet de la section ${department}. Cette oeuvre de la période ${period} a été acquise en ${accessionYear}`;
}

function displayImage(picture,measurements){
    image.src = picture;
    // on ajoute un listener sur l'image. function() permet de mettre une action sans paramètres ni retour
    image.addEventListener('click', 
        function(){
            console.log(measurements);      // dans l'API l'objet measurements est un tableau
            detDim.innerHTML = "";          // on vide le tableau des dimensions de l'objet. sinon affiche les dimensions des appels précédents
            detDim.innerHTML = measurements[0].elementMeasurements.Height;  // HTML ne sait pas lire un tableau. il faut lui préciser l'élément du tableau, objet par objet
            div.appendChild(detDim);         // on affiche le détail des dimensions    
        }
    )
}
