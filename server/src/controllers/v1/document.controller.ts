import { Request, Response, NextFunction } from 'express';
import * as DocumentService from '@services/document.service.js';
import * as activityService from '@services/activity.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const docs = await DocumentService.getAllDocuments(req.query);
    res.json({ status: 'success', data: docs });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const docData = {
      ...req.body,
      uploadedBy: (req as any).user.id,
      // In a real app, we'd handle file upload to S3/Cloudinary here and get the URL
      fileUrl: req.body.fileUrl || `https://vault.linkpro.ai/storage/${Date.now()}_${req.body.name}`,
      fileType: req.body.fileType || 'application/pdf',
      fileSize: req.body.fileSize || 1024 * 1024 * 2 // 2MB mock
    };
    
    const doc = await DocumentService.createDocument(docData);
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'CREATE',
      description: `Vault: Uploaded ${doc.type} - ${doc.name}`,
      targetId: doc.targetId || doc.id,
      targetType: doc.targetType || 'GENERAL',
      metadata: { docType: doc.type }
    });

    res.status(201).json({ status: 'success', data: doc });
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await DocumentService.deleteDocument(req.params.id as string);
    res.json({ status: 'success', message: 'Document removed from vault' });
  } catch (e) {
    next(e);
  }
};
