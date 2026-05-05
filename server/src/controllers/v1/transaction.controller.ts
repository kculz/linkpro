import { Request, Response, NextFunction } from 'express';
import * as TransactionService from '@services/transaction.service.js';
import * as activityService from '@services/activity.service.js';
import * as notificationService from '@services/notification.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await TransactionService.getAllTransactions(req.query);
    res.json({ status: 'success', data: transactions });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await TransactionService.createTransaction(req.body);
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'CREATE',
      description: `Recorded new ${transaction.type} transaction for $${transaction.amount}`,
      targetId: transaction.id,
      targetType: 'PROPERTY',
      metadata: { status: transaction.status, amount: transaction.amount }
    });

    res.status(201).json({ status: 'success', data: transaction });
  } catch (e) {
    next(e);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await TransactionService.updateTransaction(req.params.id, req.body);
    
    if (req.body.status === 'PAID') {
      await activityService.logActivity({
        userId: (req as any).user.id,
        type: 'UPDATE',
        description: `Payment confirmed: $${transaction.amount} for ${transaction.type}`,
        targetId: transaction.id,
        targetType: 'PROPERTY',
        metadata: { status: 'PAID' }
      });

      await notificationService.broadcastToAdmins({
        title: 'Payment Confirmed',
        message: `$${transaction.amount} received for ${transaction.type}`,
        type: 'SUCCESS',
        link: `/financials`
      });
    }

    res.json({ status: 'success', data: transaction });
  } catch (e) {
    next(e);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await TransactionService.getFinancialStats();
    res.json({ status: 'success', data: stats });
  } catch (e) {
    next(e);
  }
};

export const getFinanceIntelligence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const intel = await TransactionService.getFinanceIntelligence();
    res.json({ status: 'success', data: intel });
  } catch (e) {
    next(e);
  }
};

