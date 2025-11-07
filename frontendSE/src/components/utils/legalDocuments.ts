export interface LegalDocument {
  id: string;
  title: string;
  titleFr: string;
  lastUpdated: string;
  content: string;
  contentFr: string;
}

export const legalDocuments: Record<string, LegalDocument> = {
  terms: {
    id: 'terms',
    title: 'Terms of Service',
    titleFr: "Conditions d'utilisation",
    lastUpdated: 'October 30, 2025',
    content: `# Terms of Service

**Effective Date:** October 30, 2025

## 1. Acceptance of Terms

By accessing and using WellnessHub ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement.

## 2. Use License

Permission is granted to temporarily access the Service for personal, non-commercial use. This is the grant of a license, not a transfer of title, and under this license you may not:

- Modify or copy the materials
- Use the materials for any commercial purpose
- Attempt to decompile or reverse engineer any software
- Remove any copyright or proprietary notations
- Transfer the materials to another person

## 3. Health Disclaimer

WellnessHub provides health and wellness information for educational purposes only. This information is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health provider with any questions you may have regarding a medical condition.

## 4. User Accounts

When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding your password and for all activities that occur under your account.

## 5. Privacy and Data Collection

Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Service and informs users of our data collection practices.

## 6. User Content

Our Service allows you to post, link, store, share and make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you post on the Service.

## 7. Supplement Store

The Supplement Store provides links to third-party retailers. WellnessHub is not responsible for the quality, safety, or efficacy of any supplements purchased through these links. All purchases are subject to the terms and conditions of the third-party retailer.

## 8. Modifications

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page.

## 9. Termination

We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.

## 10. Limitation of Liability

In no event shall WellnessHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.

## 11. Governing Law

These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which WellnessHub operates.

## 12. Contact Information

If you have any questions about these Terms, please contact us at:
- Email: legal@wellnesshub.com
- Address: 123 Wellness Street, Health City, HC 12345

---

By using WellnessHub, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`,
    contentFr: `# Conditions d'utilisation

**Date d'entrée en vigueur :** 30 octobre 2025

## 1. Acceptation des conditions

En accédant et en utilisant WellnessHub (« le Service »), vous acceptez et acceptez d'être lié par les termes et dispositions de cet accord.

## 2. Licence d'utilisation

L'autorisation est accordée d'accéder temporairement au Service à des fins personnelles et non commerciales. Il s'agit de l'octroi d'une licence, et non d'un transfert de titre, et sous cette licence, vous ne pouvez pas :

- Modifier ou copier les matériaux
- Utiliser les matériaux à des fins commerciales
- Tenter de décompiler ou de rétro-ingénierie de tout logiciel
- Supprimer toute notation de droit d'auteur ou propriétaire
- Transférer les matériaux à une autre personne

## 3. Avertissement sur la santé

WellnessHub fournit des informations sur la santé et le bien-être à des fins éducatives uniquement. Ces informations ne sont pas destinées à remplacer les conseils médicaux professionnels, le diagnostic ou le traitement. Demandez toujours l'avis de votre médecin ou d'un professionnel de la santé qualifié pour toute question concernant une condition médicale.

## 4. Comptes utilisateur

Lorsque vous créez un compte chez nous, vous devez fournir des informations exactes, complètes et à jour. Le non-respect de cette obligation constitue une violation des Conditions. Vous êtes responsable de la protection de votre mot de passe et de toutes les activités qui se produisent sous votre compte.

## 5. Confidentialité et collecte de données

Votre utilisation du Service est également régie par notre Politique de confidentialité. Veuillez consulter notre Politique de confidentialité, qui régit également le Service et informe les utilisateurs de nos pratiques de collecte de données.

## 6. Contenu utilisateur

Notre Service vous permet de publier, lier, stocker, partager et rendre disponibles certaines informations, textes, graphiques ou autres matériaux (« Contenu »). Vous êtes responsable du Contenu que vous publiez sur le Service.

## 7. Boutique de suppléments

La Boutique de suppléments fournit des liens vers des détaillants tiers. WellnessHub n'est pas responsable de la qualité, de la sécurité ou de l'efficacité des suppléments achetés via ces liens. Tous les achats sont soumis aux termes et conditions du détaillant tiers.

## 8. Modifications

Nous nous réservons le droit, à notre seule discrétion, de modifier ou de remplacer ces Conditions à tout moment. Nous fournirons un avis de tout changement significatif en publiant les nouvelles Conditions sur cette page.

## 9. Résiliation

Nous pouvons résilier ou suspendre votre compte immédiatement, sans préavis ni responsabilité, pour quelque raison que ce soit, y compris une violation de ces Conditions. Après la résiliation, votre droit d'utiliser le Service cessera immédiatement.

## 10. Limitation de responsabilité

En aucun cas WellnessHub, ni ses administrateurs, employés, partenaires, agents, fournisseurs ou affiliés, ne seront responsables de tout dommage indirect, accessoire, spécial, consécutif ou punitif.

## 11. Loi applicable

Ces Conditions seront régies et interprétées conformément aux lois de la juridiction dans laquelle WellnessHub opère.

## 12. Coordonnées

Si vous avez des questions concernant ces Conditions, veuillez nous contacter à :
- E-mail : legal@wellnesshub.com
- Adresse : 123 Wellness Street, Health City, HC 12345

---

En utilisant WellnessHub, vous reconnaissez avoir lu, compris et accepté d'être lié par ces Conditions d'utilisation.`
  },
  
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    titleFr: 'Politique de confidentialité',
    lastUpdated: 'October 30, 2025',
    content: `# Privacy Policy

**Last Updated:** October 30, 2025

## Introduction

WellnessHub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.

## Information We Collect

### Personal Information
We collect information that you provide directly to us, including:
- Name, email address, and contact information
- Age, gender, height, and weight
- Health and fitness goals
- Medical conditions and medications (for supplement recommendations)
- Workout and nutrition data
- Mood tracking information
- Community posts and interactions

### Automatically Collected Information
We automatically collect certain information when you use our Service:
- Device information (type, operating system, unique identifiers)
- Usage data (features used, time spent, interactions)
- Log data (IP address, browser type, access times)

## How We Use Your Information

We use your information to:
- Provide, maintain, and improve our Service
- Personalize your experience and provide customized recommendations
- Track your health and wellness progress
- Send you updates, newsletters, and promotional materials
- Respond to your requests and support inquiries
- Analyze usage patterns and improve our Service
- Ensure the security and integrity of our Service

## Data Storage and Security

We implement appropriate technical and organizational measures to protect your personal information:
- Data encryption in transit and at rest
- Regular security audits and updates
- Access controls and authentication measures
- Secure data centers with redundancy

## Data Sharing

We do not sell your personal information. We may share your information with:
- Service providers who assist in operating our Service
- Third-party retailers (only when you click supplement purchase links)
- Legal authorities when required by law
- Other users (only information you choose to make public in community features)

## Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Opt-out of marketing communications
- Export your data
- Withdraw consent for data processing

## Cookies and Tracking

We use cookies and similar tracking technologies to:
- Remember your preferences
- Analyze usage patterns
- Provide personalized content
- Improve our Service

You can control cookies through your browser settings.

## Children's Privacy

Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.

## International Data Transfers

Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

## Contact Us

If you have questions about this Privacy Policy, please contact us at:
- Email: privacy@wellnesshub.com
- Address: 123 Wellness Street, Health City, HC 12345

## GDPR Compliance

For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). You have additional rights under GDPR, including:
- Right to data portability
- Right to restrict processing
- Right to object to processing
- Right to lodge a complaint with a supervisory authority

## CCPA Compliance

For California residents, we comply with the California Consumer Privacy Act (CCPA). You have the right to know what personal information we collect, how we use it, and to request deletion of your information.

---

By using WellnessHub, you acknowledge that you have read and understood this Privacy Policy.`,
    contentFr: `# Politique de confidentialité

**Dernière mise à jour :** 30 octobre 2025

## Introduction

WellnessHub (« nous », « notre » ou « nos ») s'engage à protéger votre vie privée. Cette Politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre application.

## Informations que nous collectons

### Informations personnelles
Nous collectons les informations que vous nous fournissez directement, notamment :
- Nom, adresse e-mail et coordonnées
- Âge, sexe, taille et poids
- Objectifs de santé et de fitness
- Conditions médicales et médicaments (pour les recommandations de suppléments)
- Données d'entraînement et de nutrition
- Informations de suivi de l'humeur
- Publications et interactions de la communauté

### Informations collectées automatiquement
Nous collectons automatiquement certaines informations lorsque vous utilisez notre Service :
- Informations sur l'appareil (type, système d'exploitation, identifiants uniques)
- Données d'utilisation (fonctionnalités utilisées, temps passé, interactions)
- Données de journal (adresse IP, type de navigateur, heures d'accès)

## Comment nous utilisons vos informations

Nous utilisons vos informations pour :
- Fournir, maintenir et améliorer notre Service
- Personnaliser votre expérience et fournir des recommandations personnalisées
- Suivre vos progrès en matière de santé et de bien-être
- Vous envoyer des mises à jour, des newsletters et du matériel promotionnel
- Répondre à vos demandes et demandes d'assistance
- Analyser les modèles d'utilisation et améliorer notre Service
- Assurer la sécurité et l'intégrité de notre Service

## Stockage et sécurité des données

Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos informations personnelles :
- Chiffrement des données en transit et au repos
- Audits et mises à jour de sécurité réguliers
- Contrôles d'accès et mesures d'authentification
- Centres de données sécurisés avec redondance

## Partage de données

Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos informations avec :
- Les prestataires de services qui nous aident à exploiter notre Service
- Les détaillants tiers (uniquement lorsque vous cliquez sur les liens d'achat de suppléments)
- Les autorités légales lorsque la loi l'exige
- D'autres utilisateurs (uniquement les informations que vous choisissez de rendre publiques dans les fonctionnalités de la communauté)

## Vos droits

Vous avez le droit de :
- Accéder à vos données personnelles
- Corriger les données inexactes
- Demander la suppression de vos données
- Vous désinscrire des communications marketing
- Exporter vos données
- Retirer votre consentement au traitement des données

## Cookies et suivi

Nous utilisons des cookies et des technologies de suivi similaires pour :
- Se souvenir de vos préférences
- Analyser les modèles d'utilisation
- Fournir du contenu personnalisé
- Améliorer notre Service

Vous pouvez contrôler les cookies via les paramètres de votre navigateur.

## Confidentialité des enfants

Notre Service n'est pas destiné aux enfants de moins de 13 ans. Nous ne collectons pas sciemment d'informations personnelles auprès d'enfants de moins de 13 ans.

## Transferts internationaux de données

Vos informations peuvent être transférées et traitées dans des pays autres que votre pays de résidence. Nous veillons à ce que des garanties appropriées soient en place pour de tels transferts.

## Modifications de cette politique de confidentialité

Nous pouvons mettre à jour cette Politique de confidentialité de temps en temps. Nous vous informerons de tout changement en publiant la nouvelle Politique de confidentialité sur cette page et en mettant à jour la date de « Dernière mise à jour ».

## Nous contacter

Si vous avez des questions concernant cette Politique de confidentialité, veuillez nous contacter à :
- E-mail : privacy@wellnesshub.com
- Adresse : 123 Wellness Street, Health City, HC 12345

---

En utilisant WellnessHub, vous reconnaissez avoir lu et compris cette Politique de confidentialité.`
  },

  help: {
    id: 'help',
    title: 'Help Center',
    titleFr: "Centre d'aide",
    lastUpdated: 'October 30, 2025',
    content: `# Help Center

Welcome to the WellnessHub Help Center! Find answers to common questions and learn how to make the most of our platform.

## Getting Started

### Creating Your Account
1. Download the WellnessHub app or visit our website
2. Click "Sign Up" and choose your preferred method (Email or Google)
3. Complete the onboarding process
4. Set your health and wellness goals

### Completing Your Profile
- Navigate to Settings > Profile
- Add your personal information (age, gender, height, weight)
- Set your fitness and wellness goals
- Input any medical conditions or medications for personalized recommendations

## Features

### Dashboard
Your central hub for all wellness activities:
- View today's overview
- Track quick stats
- Access quick actions
- Monitor your progress

### Nutrition Tracker
- Log meals and track calories
- View macronutrient breakdown
- Plan meals in advance
- Track water intake
- Access recipe database

### Workout Section
- Browse exercise library
- Follow structured workout plans
- Track your workouts
- Set personal records
- Access workout music

### Mental Wellbeing
- Track daily mood
- Practice guided meditation
- Journal your thoughts
- Access therapy chat
- Emergency help resources

### Supplement Store
- Browse science-backed supplements
- Get personalized recommendations based on your health profile
- Read detailed product information
- Purchase directly through trusted retailers
- View ratings and reviews

### Community
- Connect with other users
- Join challenges
- Share progress
- Participate in forums
- Compete on leaderboards

## Frequently Asked Questions

### Q: How do I change my language?
A: Go to Settings > Preferences > Language and select your preferred language.

### Q: How do I switch between light and dark mode?
A: Go to Settings > Preferences > Appearance and select your theme preference.

### Q: Are my health data secure?
A: Yes, we use industry-standard encryption and security measures to protect your data. See our Privacy Policy for details.

### Q: Can I export my data?
A: Yes! Go to Settings and click "Export Data" to download all your information.

### Q: How do supplement recommendations work?
A: Based on the medical conditions and medications you enter in your profile, we recommend supplements that may benefit you. Always consult your healthcare provider before starting any supplement.

### Q: Is WellnessHub free?
A: Yes, WellnessHub is free to use. Some premium features may be available in the future.

### Q: Can I delete my account?
A: Yes, go to Settings > Privacy > Delete Account. This action is permanent and cannot be undone.

### Q: How do I contact support?
A: Email us at support@wellnesshub.com or use the Contact Support option in Settings.

## Troubleshooting

### App is slow or not responding
- Check your internet connection
- Clear your browser cache
- Update to the latest version
- Try logging out and back in

### Data not syncing
- Ensure you're connected to the internet
- Check that you're logged in
- Refresh the page
- Contact support if the issue persists

### Can't log in
- Verify your email and password
- Try password reset
- Check if you signed up with Google
- Clear browser cookies

## Privacy & Security

### Managing Your Privacy
- Control what data you share with the community
- Adjust notification preferences
- Review privacy settings regularly
- Enable two-factor authentication (coming soon)

### Data Usage
- View how we use your data in our Privacy Policy
- Control data sharing preferences
- Request a copy of your data
- Request data deletion

## Tips for Success

1. **Set Realistic Goals**: Start with achievable targets and gradually increase difficulty
2. **Be Consistent**: Log your activities daily for best results
3. **Stay Engaged**: Participate in community challenges for motivation
4. **Track Everything**: The more data you log, the better insights you'll receive
5. **Review Analytics**: Check your progress regularly in the Analytics tab

## Contact Support

Need more help?
- Email: support@wellnesshub.com
- Response time: Within 24 hours
- Available: Monday - Friday, 9 AM - 5 PM EST

---

**Last Updated:** October 30, 2025`,
    contentFr: `# Centre d'aide

Bienvenue au Centre d'aide WellnessHub ! Trouvez des réponses aux questions courantes et apprenez à tirer le meilleur parti de notre plateforme.

## Commencer

### Création de votre compte
1. Téléchargez l'application WellnessHub ou visitez notre site Web
2. Cliquez sur "S'inscrire" et choisissez votre méthode préférée (E-mail ou Google)
3. Complétez le processus d'intégration
4. Définissez vos objectifs de santé et de bien-être

### Compléter votre profil
- Accédez à Paramètres > Profil
- Ajoutez vos informations personnelles (âge, sexe, taille, poids)
- Définissez vos objectifs de fitness et de bien-être
- Saisissez toutes conditions médicales ou médicaments pour des recommandations personnalisées

## Fonctionnalités

### Tableau de bord
Votre hub central pour toutes les activités de bien-être :
- Voir l'aperçu d'aujourd'hui
- Suivre les statistiques rapides
- Accéder aux actions rapides
- Surveiller vos progrès

### Suivi nutritionnel
- Enregistrer les repas et suivre les calories
- Voir la répartition des macronutriments
- Planifier les repas à l'avance
- Suivre l'apport en eau
- Accéder à la base de données de recettes

### Section d'entraînement
- Parcourir la bibliothèque d'exercices
- Suivre des plans d'entraînement structurés
- Suivre vos entraînements
- Établir des records personnels
- Accéder à la musique d'entraînement

### Bien-être mental
- Suivre l'humeur quotidienne
- Pratiquer la méditation guidée
- Noter vos pensées
- Accéder au chat thérapeutique
- Ressources d'aide d'urgence

### Boutique de suppléments
- Parcourir des suppléments scientifiquement prouvés
- Obtenir des recommandations personnalisées basées sur votre profil de santé
- Lire des informations détaillées sur les produits
- Acheter directement auprès de détaillants de confiance
- Voir les évaluations et les avis

## Questions fréquemment posées

### Q: Comment changer ma langue ?
R: Allez dans Paramètres > Préférences > Langue et sélectionnez votre langue préférée.

### Q: Comment basculer entre le mode clair et sombre ?
R: Allez dans Paramètres > Préférences > Apparence et sélectionnez votre préférence de thème.

### Q: Mes données de santé sont-elles sécurisées ?
R: Oui, nous utilisons le chiffrement et les mesures de sécurité standard de l'industrie pour protéger vos données.

### Q: Puis-je exporter mes données ?
R: Oui ! Allez dans Paramètres et cliquez sur "Exporter les données" pour télécharger toutes vos informations.

### Q: Comment fonctionnent les recommandations de suppléments ?
R: Sur la base des conditions médicales et des médicaments que vous saisissez dans votre profil, nous recommandons des suppléments qui peuvent vous être bénéfiques. Consultez toujours votre professionnel de la santé avant de commencer tout supplément.

## Contacter l'assistance

Besoin de plus d'aide ?
- E-mail : support@wellnesshub.com
- Temps de réponse : Dans les 24 heures
- Disponible : Lundi - Vendredi, 9h - 17h EST

---

**Dernière mise à jour :** 30 octobre 2025`
  },

  about: {
    id: 'about',
    title: 'About Us',
    titleFr: 'À propos de nous',
    lastUpdated: 'October 30, 2025',
    content: `# About WellnessHub

## Our Mission

WellnessHub is dedicated to making health and wellness accessible, personalized, and achievable for everyone. We believe that true wellness encompasses physical health, nutrition, and mental well-being, and our platform is designed to support you in all these areas.

## Who We Are

Founded in 2025, WellnessHub brings together experts in:
- Nutrition and dietetics
- Personal training and fitness
- Mental health and therapy
- Technology and user experience
- Medical research and supplements

## Our Platform

WellnessHub offers a comprehensive suite of tools to support your wellness journey:

### Nutrition Tracking
Advanced meal logging with detailed macronutrient analysis, recipe database, and meal planning features.

### Workout Programs
Structured workout plans designed by certified trainers, comprehensive exercise library, and progress tracking.

### Mental Wellness
Mood tracking, guided meditation, journaling, and access to licensed therapy professionals.

### Supplement Store
Science-backed supplement recommendations personalized to your health profile, with transparent information and trusted retailer partnerships.

### Community Support
Connect with others on similar wellness journeys, participate in challenges, and share your success.

## Our Values

### Privacy First
Your health data is personal. We use industry-leading security measures to protect your information and never sell your data to third parties.

### Evidence-Based
All our recommendations, workout plans, and supplement suggestions are based on scientific research and expert consensus.

### Personalization
We understand that everyone's wellness journey is unique. Our platform adapts to your specific goals, conditions, and preferences.

### Accessibility
We're committed to making wellness tools accessible to everyone, regardless of their starting point or experience level.

### Community
We believe in the power of community support and shared experiences in achieving wellness goals.

## Our Team

Our diverse team includes:
- **Registered Dietitians** who develop our nutrition features
- **Certified Personal Trainers** who create our workout programs
- **Licensed Therapists** who guide our mental wellness content
- **Medical Professionals** who vet our supplement recommendations
- **Software Engineers** who build our platform
- **UX Designers** who ensure ease of use

## Partnerships

We partner with:
- Leading supplement manufacturers and retailers
- Certified fitness equipment providers
- Mental health organizations
- Research institutions

## Contact Us

Have questions or feedback? We'd love to hear from you!

- Email: info@wellnesshub.com
- Support: support@wellnesshub.com
- Press: press@wellnesshub.com
- Partnerships: partnerships@wellnesshub.com

## Join Our Mission

WellnessHub is more than an app—it's a movement toward holistic health and wellness. Join thousands of users who are transforming their lives, one healthy choice at a time.

---

**Together, we're building a healthier, happier world.**`,
    contentFr: `# À propos de WellnessHub

## Notre mission

WellnessHub se consacre à rendre la santé et le bien-être accessibles, personnalisés et réalisables pour tous. Nous croyons que le vrai bien-être englobe la santé physique, la nutrition et le bien-être mental, et notre plateforme est conçue pour vous soutenir dans tous ces domaines.

## Qui sommes-nous

Fondé en 2025, WellnessHub rassemble des experts en :
- Nutrition et diététique
- Entraînement personnel et fitness
- Santé mentale et thérapie
- Technologie et expérience utilisateur
- Recherche médicale et suppléments

## Notre plateforme

WellnessHub offre une suite complète d'outils pour soutenir votre parcours de bien-être :

### Suivi nutritionnel
Enregistrement avancé des repas avec analyse détaillée des macronutriments, base de données de recettes et fonctionnalités de planification des repas.

### Programmes d'entraînement
Plans d'entraînement structurés conçus par des entraîneurs certifiés, bibliothèque d'exercices complète et suivi des progrès.

### Bien-être mental
Suivi de l'humeur, méditation guidée, journal et accès à des professionnels de la thérapie agréés.

### Boutique de suppléments
Recommandations de suppléments scientifiquement prouvées personnalisées selon votre profil de santé, avec des informations transparentes et des partenariats avec des détaillants de confiance.

### Soutien communautaire
Connectez-vous avec d'autres personnes sur des parcours de bien-être similaires, participez à des défis et partagez votre succès.

## Nos valeurs

### La confidentialité d'abord
Vos données de santé sont personnelles. Nous utilisons des mesures de sécurité de pointe pour protéger vos informations et ne vendons jamais vos données à des tiers.

### Basé sur des preuves
Toutes nos recommandations, plans d'entraînement et suggestions de suppléments sont basés sur la recherche scientifique et le consensus d'experts.

### Personnalisation
Nous comprenons que le parcours de bien-être de chacun est unique. Notre plateforme s'adapte à vos objectifs, conditions et préférences spécifiques.

### Accessibilité
Nous nous engageons à rendre les outils de bien-être accessibles à tous, quel que soit leur point de départ ou leur niveau d'expérience.

### Communauté
Nous croyons au pouvoir du soutien communautaire et des expériences partagées pour atteindre les objectifs de bien-être.

## Contactez-nous

Vous avez des questions ou des commentaires ? Nous aimerions vous entendre !

- E-mail : info@wellnesshub.com
- Support : support@wellnesshub.com
- Presse : press@wellnesshub.com
- Partenariats : partnerships@wellnesshub.com

---

**Ensemble, nous construisons un monde plus sain et plus heureux.**`
  }
};
