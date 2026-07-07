import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

const analyzeCVSchema = z.object({
  cvContent: z.string().min(100),
  targetJob: z.string().optional(),
});

const analyzeOfferSchema = z.object({
  offerContent: z.string().min(50),
  cvContent: z.string().min(100),
});

router.post('/analyze-cv', async (req, res, next) => {
  try {
    const { cvContent, targetJob } = analyzeCVSchema.parse(req.body);
    const analysis = {
      overallScore: 78,
      sections: {
        layout: 85, content: 72, keywords: 65, readability: 88, experience: 80,
      },
      errors: [
        { type: 'grammar', message: "Utilisez des verbes d'action au début de chaque bullet point", severity: 'medium' },
        { type: 'format', message: 'Standardisez les dates au format MM/YYYY', severity: 'low' },
        { type: 'content', message: 'Ajoutez des résultats quantifiés pour chaque expérience', severity: 'high' },
      ],
      suggestions: [
        'Ajoutez des compétences techniques spécifiques (AutoCAD, Revit, BIM)',
        'Incluez une section "Projets" avec des réalisations concrètes',
        'Optimisez le résumé pour inclure des mots-clés du génie civil',
        'Ajoutez des certifications pertinentes (BTP, sécurité, management)',
      ],
      keywords: {
        found: ['génie civil', 'BTP', 'projet', 'construction', 'AutoCAD'],
        missing: ['BIM', 'REVIT', 'management de projet', 'normes Eurocodes', 'BET'],
        score: 65,
      },
      atsCompatibility: {
        score: 82,
        issues: [
          'Évitez les tableaux et les colonnes qui peuvent bloquer les ATS',
          'Utilisez des titres de section standard (Expérience, Formation, Compétences)',
        ],
      },
      improvedVersion: cvContent.substring(0, 500) + "\n\n[Version optimisée par l'IA...]",
    };
    res.json(analysis);
  } catch (error) { next(error); }
});

router.post('/compare-offer', async (req, res, next) => {
  try {
    const { offerContent, cvContent } = analyzeOfferSchema.parse(req.body);
    const compatibility = {
      score: 73,
      matchingSkills: [
        { skill: 'Génie civil', level: 'expert' },
        { skill: 'AutoCAD', level: 'intermediate' },
        { skill: 'Gestion de projet', level: 'intermediate' },
      ],
      missingSkills: [
        { skill: 'BIM / Revit', importance: 'high' },
        { skill: 'Eurocodes', importance: 'medium' },
        { skill: 'Anglais technique', importance: 'medium' },
      ],
      recommendations: [
        'Mettez en avant votre expérience avec les logiciels de CAO',
        'Ajoutez une certification BIM si possible',
        'Détaillez vos compétences en calcul de structure',
      ],
      optimizedCV: '[CV optimisé pour cette offre spécifique...]',
      coverLetter: "Madame, Monsieur,\n\nVotre offre d'alternance en génie civil...",
    };
    res.json(compatibility);
  } catch (error) { next(error); }
});

router.get('/insights', async (req, res, next) => {
  try {
    const insights = [
      {
        type: 'performance',
        title: 'Performance sectorielle',
        message: 'Vos candidatures dans le secteur du génie civil obtiennent un taux de réponse de 35%, supérieur à la moyenne de 22%.',
        priority: 'high',
      },
      {
        type: 'timing',
        title: 'Timing optimal',
        message: "Les candidatures envoyées le mardi matin génèrent 2.3x plus d'entretiens. Privilégiez ce créneau.",
        priority: 'medium',
      },
      {
        type: 'followup',
        title: 'Relance recommandée',
        message: '3 candidatures sans réponse depuis +10 jours. Une relance J7-J10 augmente vos chances de 40%.',
        priority: 'high',
      },
      {
        type: 'optimization',
        title: 'Optimisation CV',
        message: "L'ajout de mots-clés BIM et Eurocodes augmenterait votre compatibilité ATS de 15%.",
        priority: 'medium',
      },
    ];
    res.json({ insights });
  } catch (error) { next(error); }
});

export { router as aiRouter };
