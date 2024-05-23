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
                sl: req.body.sl,
                pnl: req.body.pnl,
                winlossdraw: req.body.winlossdraw,
                image:req.body.image,
                userId:req.userId
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
                sl: req.body.sl,
                pnl: req.body.pnl,
                winlossdraw: req.body.winlossdraw,
                image:req.body.image
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

        let totalProfit = 0;
        let totalLoss = 0;
        let winCount = 0;
        let lossCount = 0;

        trades.forEach(trade => {
            if (trade.winlossdraw=="WIN") {
                totalProfit += trade.pnl;
                winCount++;
            } else if(trade.winlossdraw=="LOSS"){
                totalLoss += trade.pnl;
                lossCount++;
            }
        });

        const totalTrades = trades.length;
        const winPercentage = ((winCount / totalTrades) * 100).toFixed(0);
        const lossPercentage = ((lossCount / totalTrades) * 100).toFixed(0);
        const avgPnl = ((totalProfit + totalLoss) / totalTrades).toFixed(0);
        const avgProfit = (totalProfit/winCount).toFixed(0);
        const avgLoss =(totalLoss/lossCount).toFixed(0);
        const winRatio = `${winCount}/${trades.length}`;

        return res.status(STATUS_CODE.SUCCESS).json({
            msg: "successfully",
            data: {
                avgPnl: avgPnl,
                avgProfit: avgProfit,
                avgLoss: avgLoss,
                winPercentage: winPercentage,
                lossPercentage: lossPercentage,
                winRatio: winRatio,
                totalProfit: totalProfit,
                totalLoss: totalLoss,
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