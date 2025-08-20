import { Router } from 'express';
import { prisma } from '../db';
import { createTodoSchema, updateTodoSchema } from '../validators/todo.schema';
import { Prisma } from '@prisma/client';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { q, completed, sort = 'new', page = '1', pageSize = '10' } =
      req.query as Record<string, string>;

    const where: Prisma.TodoWhereInput = {};

    if (completed === 'true') where.isCompleted = true;
    if (completed === 'false') where.isCompleted = false;

    if (q && q.trim()) {
      where.OR = [
        { title: { contains: q } },        // removed mode
        { description: { contains: q } }   // removed mode
      ];
    }

    const orderBy: Prisma.TodoOrderByWithRelationInput =
      sort === 'old'
        ? { createdAt: 'asc' }
        : sort === 'title'
        ? { title: 'asc' }
        : { createdAt: 'desc' };

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const sizeNum = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 100);

    const [items, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        orderBy,
        skip: (pageNum - 1) * sizeNum,
        take: sizeNum,
      }),
      prisma.todo.count({ where }),
    ]);

    res.json({
      data: items,
      pagination: {
        page: pageNum,
        pageSize: sizeNum,
        total,
        totalPages: Math.ceil(total / sizeNum),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) return res.status(404).json({ error: 'Not found' });
    res.json(todo);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = createTodoSchema.parse(req.body);
    const created = await prisma.todo.create({ data: parsed });
    res.status(201).json(created);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      err.status = 400;
      err.message = 'Validation failed';
      err.details = err.issues;
    }
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const parsed = updateTodoSchema.parse(req.body);
    const updated = await prisma.todo.update({
      where: { id },
      data: parsed,
    });
    res.json(updated);
  } catch (err: any) {
    if (err.code === 'P2025') {
      err.status = 404;
      err.message = 'Not found';
    }
    if (err.name === 'ZodError') {
      err.status = 400;
      err.message = 'Validation failed';
      err.details = err.issues;
    }
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') {
      err.status = 404;
      err.message = 'Not found';
    }
    next(err);
  }
});

export default router;
