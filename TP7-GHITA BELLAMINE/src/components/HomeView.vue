<template>
  <main>
   <section class= "left-section">
    <!-- Filtres -->
    <section class="filtres">
      <h2>Filtres</h2>
      <input v-model="search" placeholder="Rechercher une pièce...">
      <select v-model="categorie">
        <option value="">Toutes les catégories</option>
        <option v-for="(cat, index) in uniqueCategories" :key="index" :value="cat">
          {{ cat }}
        </option>
      </select>
      <label>
        <input type="checkbox" v-model="stock">
        Disponible en stock
      </label>
      <select v-model="tri">
        <option value="">Trier par prix</option>
        <option value="asc">Prix croissant</option>
        <option value="desc">Prix décroissant</option>
      </select>
    </section>
  <!-- Panier -->
<section class="panier">
  <h2>🛒Panier</h2>
  <ul>
    <li v-for="(item, index) in panier" :key="index">
      {{ item.nom }} - {{ item.prix }}€
      <button @click="removeFromPanier(index)">Supprimer</button> <!-- Remove button -->
    </li>
  </ul>
  <p v-if="panier.length > 0"><strong>Total: {{ totalPrix }}€</strong></p>
  <p v-else>Votre panier est vide</p>
</section>
</section>
<!-- Liste des pièces -->
    <section class="fiches">
      <div v-for="piece in piecesFiltrees" :key="piece.id" class="piece">
        <img :src="piece.image" :alt="piece.nom">
        <h3>{{ piece.nom }}</h3>
        <p>Prix: {{ piece.prix }}€</p>
        <p>Catégorie: {{ piece.categorie }}</p>
        <button v-if="piece.disponible" @click="ajouterAuPanier(piece)">Ajouter au panier</button>
        <p v-else style="color: red;font-weight:bold">Rupture de stock</p>
      </div>
    </section>
  </main>
</template>

<script>
import piecesData from "../data/pieces-auto.json";

export default {
  name: "HomeView",
  data() {
    return {
      search: "",
      categorie: "",
      stock: false,
      tri: "",
      panier: [],
      pieces: piecesData
    };
  },
  computed: {
  uniqueCategories() {
    return [...new Set(this.pieces.map(piece => piece.categorie))];
  },
  piecesFiltrees() {
    let filtered = this.pieces.filter(piece =>
      piece.nom.toLowerCase().includes(this.search.toLowerCase()) &&
      (this.categorie === "" || piece.categorie === this.categorie) &&
      (!this.stock || piece.disponible)
    );

    if (this.tri === "asc") {
      return filtered.sort((a, b) => a.prix - b.prix);
    }
    if (this.tri === "desc") {
      return filtered.sort((a, b) => b.prix - a.prix);
    }
    return filtered;
  },
  totalPrix() {
    return this.panier.reduce((total, item) => total + item.prix, 0).toFixed(2); 
  }
},

  methods: {
    ajouterAuPanier(piece) {
      this.panier.push(piece);
    },
  removeFromPanier(index) {
    this.panier.splice(index, 1); 
  }
}
};
</script>

<style scoped>

main {
  display: flex;
  flex-direction: row;
  gap:2em;
}
select, input{
  font-size:1.1em;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 16px; 
  min-width: 300px;
  margin: 8px;
}

.filtres, .panier {
  border-radius: 4px;
  box-shadow: 0px 0px 4px gray;
  padding: 8px;
  display:flex;
  flex-direction: column;
  gap:2em;
  transition: box-shadow 0.3s ease, transform 0.2s;
}
.filtres:hover, .panier:hover {
  transform: scale(1.02);
}
.filtres h2{
  text-align: center;
}

.fiches {
  flex-grow: 1;
  margin: 8px;
  display: flex;
  flex-wrap: wrap; 
  gap: 2em;
}

.piece {
  border: 1px solid #ccc;
  padding: 2em;
  width: calc(33% - 5px); 
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  border-radius: 8px; 
  background-color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.piece:hover {
  transform: translateY(-10px); 
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.piece img {
  max-width: 80%; 
  height: auto;
  margin-bottom: 10px;
  border-radius: 8px; 
}

.piece h3 {
  font-size: 1.1rem;
  margin: 10px 0;
  color: #222;
}

.piece p {
  font-size: 1rem;
  color: #333;
}

.piece button {
  background-color: #4CAF50;
  color: white;
  border: none;
  font-size:1.1em;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.piece button:hover {
  background-color: #45a049;
  transform : scale(1.05)
  
}

.piece p.red {
  color: red;
  font-weight: bold;
}

.fiches img {
  max-width: 100%;
  height: auto;
}
.panier button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 6px 12px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.panier button:hover {
  background-color: #e53935;
}
input, select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border 0.3s ease-in-out;
}

input:focus, select:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}
</style>
