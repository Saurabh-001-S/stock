import { PrismaClient } from "@prisma/client";
const exp = require('express')
const stock = exp.Router();
import { authMiddleware } from "../Middleware/index";

enum STATUS_CODE {
    SUCCESS = 200,
    ERROR = 500,
    BADREQ = 400,
    NOTFOUND = 404,
    NOTPERMISSIOON = 403,
}

stock.get('/get-allentry', authMiddleware, async (req:any,res:any) => {
    const prisma = new PrismaClient()
    
    try {
        const response = await prisma.trade.findMany({
            where: {
                userId :req.userId
            },
        });

        if (response.length == 0) {
            return res.status(STATUS_CODE.NOTFOUND).json({
                msg:"Nothing found, Please try again!"
            })
        }
        console.log(response)
        return res.status(STATUS_CODE.SUCCESS).json({
            msg: "successfully",
            data: response,
        })

    } catch (error) {
        return res.status(STATUS_CODE.ERROR).json({
            msg: "Internal server error, Please try again!",
            error:error
        })
    }finally {
        await prisma.$disconnect()
    }
})

stock.post('/add-stockEntry',authMiddleware ,async (req:any,res:any)  => {
    const prisma = new PrismaClient();

    try {
        const response = await prisma.trade.create({
            data: {
                contract: req.body.contract,
                entryTimeFrame: req.body.entryTimeFrame,
                entryReason: req.body.entryReason,
                exitReason: req.body.exitReason,
                description: req.body.description,
                pnl: req.body.pnl,
                winlossdraw: req.body.winlossdraw,
                image:req.body.image,
                region:req.body.region,
                userId: req.userId,
                brokerage:req.body.brokerage
            }
        })

        return res.status(STATUS_CODE.SUCCESS).json({
            msg: "New entry created successfully",
            data: response
        })

    } catch (error) {
        console.log(error)
        return res.status(STATUS_CODE.ERROR).json({
            msg: `Internal server error`,
            error:error
        })
    } finally {
        await prisma.$disconnect();
    }
})


stock.put('/update-stockEntry',authMiddleware, async (req:any,res:any) => {
    const prisma = new PrismaClient()

    try {
        const isEntryexist = await prisma.trade.findUnique({
            where: {
                id: req.body.id,
                userId:req.userId
            }
        })

        if (isEntryexist == null) {
            return res.status(STATUS_CODE.NOTFOUND).json({
                msg:"Nothing found, Please try again!"
            })
        }

        const response = await prisma.trade.update({
            data: {
                contract: req.body.contract,
                entryTimeFrame: req.body.entryTimeFrame,
                entryReason: req.body.entryReason,
                exitReason: req.body.exitReason,
                description: req.body.description,
                pnl: req.body.pnl,
                winlossdraw: req.body.winlossdraw,
                image: req.body.image,
                region:req.body.region,
                brokerage:req.body.brokerage
            },
            where: {
                id: req.body.id,
                userId:req.get('userId')
            }
        })

        return res.status(STATUS_CODE.SUCCESS).json({
            msg: "Entry updated successfully",
            data: response
        })
    } catch (error) {
        console.log(error)
        return res.status(STATUS_CODE.ERROR).json({
                msg: `Internal server error`,
                error:error
            })
    } finally {
        await prisma.$disconnect();
    }

})

stock.delete('/delete-stockEntry', authMiddleware, async (req:any,res:any) => {
    const prisma = new PrismaClient()

    try {
        const isEntryexist = await prisma.trade.findUnique({
            where: {
                id: req.body.id,
                userId:req.get('userId')
            }
        })

        if (isEntryexist == null) {
            return res.status(STATUS_CODE.NOTFOUND).json({
                msg:"Nothing found, Please try again!"
            })
        }
        const response = await prisma.trade.delete({
            where: {
                id: req.body.id,
                userId:req.get('userId')
            }
        })

        return res.status(STATUS_CODE.SUCCESS).json({
            msg: "Entry deleted successfully",
            data:response
        })
        

    } catch (error) {
        return res.status(STATUS_CODE.ERROR).json({
                msg: `Internal server error`,
                error:error
            })
    } finally {
        await prisma.$disconnect();
    }
})

stock.get('/find-stockEntry/:id', authMiddleware, async (req:any,res:any) => {
    const prisma = new PrismaClient()

    try {
        const isEntryexist = await prisma.trade.findFirst({
            where: {
                id: Number(req.params.id),
                userId:req.userId
            }
        })
        console.log(isEntryexist)
        if (isEntryexist == null) {
            return res.status(STATUS_CODE.NOTFOUND).json({
                msg:"Nothing found, Please try again!"
            })
        }

        return res.status(STATUS_CODE.SUCCESS).json({
            msg: "Entry find successfully",
            data:isEntryexist
        })
    } catch (error) {
        console.log(error)
        return res.status(STATUS_CODE.ERROR).json({
                msg: `Internal server error`,
                error:error
            })
    } finally {
        await prisma.$disconnect();
    }
})


stock.get('/statistics', authMiddleware, async (req: any, res: any) => {
    const prisma = new PrismaClient();

    try {
        const trades = await prisma.trade.findMany({
            where: {
                userId: req.userId,
            },
        });

        if (trades.length === 0) {
            return res.status(STATUS_CODE.NOTFOUND).json({
                msg: "Nothing found, Please try again!",
            });
        }

        let IND_totalProfit = 0;
        let IND_totalLoss = 0;
        let IND_winCount = 0;
        let IND_lossCount = 0;
        let IND_maxProfit = 0;
        let IND_minloss = 0;
        let IND_brokerage = 0;
        
        let FRX_totalProfit = 0;
        let FRX_totalLoss = 0;
        let FRX_winCount = 0;
        let FRX_lossCount = 0;
        let FRX_maxProfit = 0;
        let FRX_minloss = 0;
        let FRX_brokerage = 0;

        trades.forEach(trade => {

            if (trade.region == "IND" && trade.winlossdraw=="WIN") {
                IND_maxProfit = trade.pnl;
            }
            if (trade.region == "IND" && trade.winlossdraw=="LOSS") {
                IND_minloss = trade.pnl;
            }

            if (trade.region == "FOREX" && trade.winlossdraw=="WIN") {
                FRX_maxProfit = trade.pnl;
            }
            if (trade.region == "FOREX" && trade.winlossdraw=="LOSS") {
                FRX_minloss = trade.pnl;
            }


            if (trade.winlossdraw=="WIN" && trade.region=="IND") {
                IND_totalProfit += trade.pnl;
                IND_brokerage += trade.brokerage;
                IND_winCount++;
            } else if(trade.winlossdraw=="LOSS" && trade.region=="IND"){
                IND_totalLoss += trade.pnl;
                IND_brokerage += trade.brokerage;
                if (trade.pnl > IND_minloss) {
                    IND_minloss = trade.pnl;
                }   
                IND_lossCount++;
            } else if (trade.winlossdraw == "DRAW" && trade.region == "IND") {
                IND_brokerage += trade.brokerage;
            }


            if (trade.winlossdraw=="WIN" && trade.region=="FOREX") {
                FRX_totalProfit += trade.pnl;
                FRX_brokerage += trade.brokerage;
                FRX_winCount++;
            } else if(trade.winlossdraw=="LOSS" && trade.region=="FOREX"){
                FRX_totalLoss += trade.pnl;
                FRX_brokerage += trade.brokerage;
                if (trade.pnl > FRX_minloss) {
                    FRX_minloss = trade.pnl;
                }   
                FRX_lossCount++;
            }else if (trade.winlossdraw == "DRAW" && trade.region == "FOREX") {
                FRX_brokerage += trade.brokerage;
            }

            // Check for max and min profit for IND
            if (trade.pnl > IND_maxProfit  && trade.region=="IND" && IND_maxProfit!=0) {
                IND_maxProfit = trade.pnl;
            }

            if (trade.pnl < IND_minloss && trade.region=="IND"&& IND_minloss!=0) {
                IND_minloss = trade.pnl;
            }

            // Check for max and min profit for FOREX
            if (trade.pnl > FRX_maxProfit && trade.region=="FOREX" && FRX_maxProfit!=0) {
                FRX_maxProfit = trade.pnl;
            }

            if (trade.pnl < FRX_minloss && trade.region=="FOREX" && FRX_minloss!=0) {
                FRX_minloss = trade.pnl;
            }
        });

        const totalTrades = trades.length;
        const IND_winPercentage = ((IND_winCount / totalTrades) * 100).toFixed(0);
        const IND_lossPercentage = ((IND_lossCount / totalTrades) * 100).toFixed(0);
        const IND_totalPnl = (IND_totalProfit - IND_totalLoss) - IND_brokerage;
        const IND_winRatio = `${IND_winCount}/${trades.length}`;

        const FRX_winPercentage = ((FRX_winCount / totalTrades) * 100).toFixed(0);
        const FRX_lossPercentage = ((FRX_lossCount / totalTrades) * 100).toFixed(0);
        const FRX_totalPnl = (FRX_totalProfit - FRX_totalLoss) - FRX_brokerage;
        const FRX_winRatio = `${FRX_winCount}/${trades.length}`;
        

        return res.status(STATUS_CODE.SUCCESS).json({
            msg: "successfully",
            data: {
                IND_totalPnl: IND_totalPnl,
                IND_winPercentage: IND_winPercentage,
                IND_lossPercentage: IND_lossPercentage,
                IND_winRatio: IND_winRatio,
                IND_totalProfit: IND_totalProfit,
                IND_totalLoss: IND_totalLoss,
                IND_maxProfit: IND_maxProfit,
                IND_minloss: IND_minloss,
                IND_brokerage:IND_brokerage,

                FRX_totalPnl: FRX_totalPnl,
                FRX_winPercentage: FRX_winPercentage,
                FRX_lossPercentage: FRX_lossPercentage,
                FRX_winRatio: FRX_winRatio,
                FRX_totalProfit: FRX_totalProfit,
                FRX_totalLoss: FRX_totalLoss,
                FRX_maxProfit: FRX_maxProfit,
                FRX_minloss: FRX_minloss,
                FRX_brokerage:FRX_brokerage
            },
        });
    } catch (error) {
        return res.status(STATUS_CODE.ERROR).json({
            msg: "Internal server error, Please try again!",
            error: error,
        });
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = stock;