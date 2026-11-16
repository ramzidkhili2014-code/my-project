# ITDesk Pro 🖥️ — Application de Gestion du Service Informatique

**ITDesk Pro** est une application web moderne de gestion de services informatiques (ITSM), combinant un système de support Helpdesk, la gestion d'inventaire du parc matériel, et le suivi des licences logicielles / abonnements SaaS.

---

## 🚀 Fonctionnalités Principales

### 1. 📊 Tableau de Bord (Dashboard)
* **Indicateurs Clés (KPIs)** : Tickets actifs, incidents critiques, taux de résolution, taux d'équipement de la flotte et budget annuel des licences.
* **Alertes en temps réel** : Signalement immédiat des pannes bloquantes et des licences proches de la saturation (>90%).
* **Vue synthétique du parc** : Répartition par catégories (ordinateurs portables, fixes, écrans, serveurs, routeurs, imprimantes).

### 2. 🎫 Helpdesk & Gestion des Tickets
* **Suivi complet des demandes** : Statuts (*Nouveau, Pris en charge, En attente, Résolu, Clôturé*), niveaux de priorités (*Basse, Moyenne, Haute, Critique*).
* **Filtres et recherche instantanée** : Par catégorie (Matériel, Réseau, Logiciel, Accès, Sécurité), collaborateur ou technicien assigné.
* **Espace d'intervention** : Prise en charge, attribution de technicien, historique des échanges et ajout de notes internes privées.

### 3. 💻 Parc Informatique & Équipements (Assets)
* **Inventaire du matériel** : Suivi des ordinateurs, serveurs, écrans et équipements réseau.
* **Informations de traçabilité** : Numéro de série (S/N), adresse IP, emplacement physique, date d'achat et fin de garantie.
* **Affectation aux collaborateurs** : Visualisation en un coup d'œil de qui utilise quelle machine ou ce qui reste disponible en stock.

### 4. 🔑 Licences & Abonnements SaaS
* **Suivi des contrats** : Suivi du nombre de sièges utilisés vs achetés avec barres de capacité.
* **Budget & Échéances** : Coût annuel global et alertes sur les dates de renouvellement.

### 5. 👥 Annuaire des Collaborateurs
* Liste des utilisateurs par département, consultation des équipements qui leur sont rattachés et création rapide de tickets.

### 6. 💾 Export de Données
* Export instantané en fichier **CSV** pour les tickets et le parc matériel.

---

## 🛠️ Stack Technique

* **Framework** : [Next.js 14](https://nextjs.org/) (App Router, React 18)
* **Langage** : [TypeScript](https://www.typescriptlang.org/)
* **Styles** : [Tailwind CSS](https://tailwindcss.com/)
* **Icônes** : [Lucide React](https://lucide.dev/)
* **Persistance** : Synchronisation réactive LocalStorage avec données de démonstration d'entreprise.

---

## 💻 Démarrage Rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Rendez-vous ensuite sur `http://localhost:3000` pour accéder à la plateforme.
