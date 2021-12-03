import { Router, Response, NextFunction } from 'express';
import { Op, Sequelize } from 'sequelize';
import Controller from '@interfaces/Controller';
import RequestWithProfile from '@interfaces/RequestWithProfile';
import { getProfile } from '@middlewares/GetProfile';
import EntityNotFoundException from '@exceptions/EntityNotFoundException';


class AdminController implements Controller {
    public path = '/admin';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/best-profession`, [getProfile], this.getBestProfessionInRange);
        this.router.get(`${this.path}/best-clients?start=<date>&end=<date>&limit=<integer>`, [getProfile], this.getBestClientsInRange);
    }

    /**
     * getBestProfessionInRange Returns the profession with highest aggregate 
     * earning within a date range
     * @param request express request - user must pass profile_id header
     * @param response express response
     * @param next 
    */
    private async getBestProfessionInRange(request: RequestWithProfile, response: Response, next: NextFunction) {
        const startDate = new Date(request.query.start as string);
        const endDate = new Date(request.query.end as string);

        const { Profile, Contract, Job } = request.app.get('models');
        const profiles = await Profile.findAll({
            group: ['profession'],
            attributes: ['profession'],
            include: {
                model: Contract,
                as: "Contractor",
                required: true,
                include: {
                    model: Job,
                    as: "Contracts",
                    attributes: [[Sequelize.fn('sum', Sequelize.col('price')), 'totalEarnings']],
                    required: true,
                    where: {
                        createdAt: {
                            [Op.between]: [startDate, endDate]
                        }
                    }
                }
            }
        })
        if (profiles.length == 0) return next(new EntityNotFoundException('Profile'));
        return response.json(profiles);
    }

     /**
     * getBestClientsInRange Returns array of clients that paid the highest 
     * within a range, can limit number of entities returned, default: 2
     * @param request express request - user must pass profile_id header
     * @param response express response
     * @param next 
    */
      private async getBestClientsInRange(request: RequestWithProfile, response: Response, next: NextFunction) {
        // const startDate = new Date(request.body.start);
        // const endDate = new Date(request.body.end);

        const { Profile, Contract, Job } = request.app.get('models');
        const profiles = await Profile.findAll({
            group: ['profession'],
            attributes: ['profession'],
            include: {
                model: Contract,
                as: "Contractor",
                attributes: [],
                required: true,
                include: {
                    model: Job,
                    as: "Contracts",
                    attributes: [[Sequelize.fn('sum', Sequelize.col('price')), 'totalEarnings']],
                    required: true
                }
            }
        })
        if (profiles.length == 0) return next(new EntityNotFoundException('Profile'));
        return response.json(profiles);
    }

}

export default AdminController;