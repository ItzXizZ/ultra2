import { Router, Request, Response } from 'express';
import { OpportunitySubmission } from '@/models/OpportunitySubmission';
import { Op } from 'sequelize';

const router = Router();

// GET /api/opportunities - Get public opportunities (exactly matches Flask endpoint)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { source } = req.query;
    
    let whereClause: any = {
      status: 'approved'
    };
    
    if (source) {
      whereClause.source = source;
    }
    
    const opportunities = await OpportunitySubmission.findAll({
      where: whereClause,
      order: [
        ['priority', 'DESC'],
        ['created_at', 'DESC']
      ]
    });
    
    res.json({
      success: true,
      opportunities: opportunities.map(opp => opp.toJSON())
    });
    
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/opportunities/:id - Get specific opportunity (exactly matches Flask endpoint)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const opportunity = await OpportunitySubmission.findOne({
      where: {
        id: parseInt(id),
        status: 'approved'
      }
    });
    
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }
    
    res.json({
      success: true,
      opportunity: opportunity.toJSON()
    });
    
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router; 