// Configuration des options PDF
const pdfOptions = {
    margin: 10,
    filename: 'chapitre.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
};

// Fonction pour générer le PDF d'un chapitre
function generateChapterPDF(chapterElement, chapterName) {
    // Créer une copie du chapitre pour le PDF
    const pdfContent = chapterElement.cloneNode(true);

    // Supprimer le bouton de téléchargement du PDF
    const downloadButton = pdfContent.querySelector('.download-pdf');
    if (downloadButton) {
        downloadButton.remove();
    }

    // Mettre à jour le nom du fichier
    const options = {
        ...pdfOptions,
        filename: `tutoriel-word-${chapterName}.pdf`
    };

    // Générer le PDF
    html2pdf()
        .set(options)
        .from(pdfContent)
        .save()
        .catch(err => console.error('Erreur lors de la génération du PDF:', err));
}

// Initialiser les boutons de téléchargement
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter les gestionnaires d'événements aux boutons
    document.querySelectorAll('.download-pdf').forEach(button => {
        button.addEventListener('click', function() {
            const chapterName = this.getAttribute('data-chapter');
            const chapterSection = this.closest('.chapter-section');

            if (chapterSection) {
                generateChapterPDF(chapterSection, chapterName);
            }
        });
    });
});
