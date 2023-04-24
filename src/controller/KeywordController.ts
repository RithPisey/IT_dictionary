import { Request, Response, Router } from "express";
import { prisma } from "../dataSource";

export class KeywordController {
  private _router: Router;
  constructor() {
    this._router = Router();
    this.setRoutes();
  }

  private setRoutes() {
    this._router.get("/fetch-keyword", async function (req, res) {
      const keywords = await prisma.keyword.findMany({
        select: {
          id: true,
          Attributes: true,
          explanation: true,
          keyword: true,
          Responsible_People: true,
          start_letter: true,
          is_new: true,
          approved_date_by_commitee: true,
        },
        orderBy: {
          start_letter: "asc",
        },
      });
      if (keywords) {
        return res.status(200).json({ msg: "success", keywords: keywords });
      } else {
        res.status(200).json({ msg: "failure" });
      }
    });
    this._router.post("/set-device-id", async function (req, res) {
      const { did } = req.body;
      const keywords = await prisma.keyword.findMany({
        select: {
          id: true,
          Attributes: true,
          explanation: true,
          keyword: true,
          Responsible_People: true,
          start_letter: true,
          is_new: true,
          approved_date_by_commitee: true,
        },
        orderBy: {
          start_letter: "asc",
        },
      });
      const device_id = await prisma.devices.findUnique({
        where: {
          device_id: did,
        },
      });

      if (!device_id) {
        const device = await prisma.devices.create({
          data: { device_id: did },
        });
        if (keywords) {
          return res.status(200).json({ msg: "success", keywords: keywords });
        } else {
          res.status(200).json({ msg: "failure" });
        }
      } else {
        if (keywords) {
          return res.status(200).json({ msg: "success", keywords: keywords });
        } else {
          res.status(200).json({ msg: "failure" });
        }
      }
    });
    this._router.post("/check-saved-keyword", async function (req, res) {
      const { kid, did } = req.body;
      const keyword = await prisma.keyword_device.findFirst({
        where: {
          device_id: did,
          keyword_id: kid,
        },
        select: {
          keyword: true,
        },
      });

      if (keyword) {
        return res.status(200).json({ issaved: true });
      } else {
        return res.status(200).json({ issaved: false });
      }
    });
    this._router.post("/save-keyword", async function (req, res) {
      const { kid, did } = req.body;
      const kd = await prisma.keyword_device.findFirst({
        where: {
          device_id: did,
          keyword_id: kid,
        },
        select: {
          id: true,
        },
      });
      if (!kd) {
        const keyword_device = await prisma.keyword_device.create({
          data: {
            device_id: did,
            keyword_id: kid,
          },
        });
        if (keyword_device) {
          return res.status(200).json({ save: true });
        } else {
          return res.status(200).json({ fail: false });
        }
      } else {
        return res.status(200).json({ fail: false });
      }
    });
    this._router.post("/saved-keyword", async (req, res) => {
      const { did } = req.body;
      const keyword_device = await prisma.keyword_device.findMany({
        where: {
          device_id: did,
        },
        select: {
          keyword: true,
        },
      });
      if (keyword_device) {
        return res
          .status(200)
          .json({ msg: "success", keywords: keyword_device });
      } else {
        res.status(200).json({ msg: "failure" });
      }
    });
    this._router.post("/unsaved-keyword", async (req, res) => {
      const { kid, did } = req.body;
      const kd = await prisma.keyword_device.findFirst({
        where: {
          device_id: did,
          keyword_id: kid,
        },
        select: {
          id: true,
        },
      });
      if (kd) {
        const keyword_device = await prisma.keyword_device.delete({
          where: {
            device_id: did,
            keyword_id: kid,
          },
        });
        if (keyword_device) {
          res.status(200).json({ msg: "deleted", isDleted: true });
        } else {
          res.status(200).json({ msg: "Cannot delete", isDleted: false });
        }
      } else {
        res.status(200).json({ msg: "Cannot delete", isDleted: false });
      }
    });
    this._router.post("/unsave-keyword", async (req, res) => {
      const { kid, did } = req.body;
      const kd = await prisma.keyword_device.findFirst({
        where: {
          device_id: did,
          keyword_id: kid,
        },
        select: {
          id: true,
        },
      });
      if (kd) {
        const keyword_device = await prisma.keyword_device.delete({
          where: {
            device_id: did,
            keyword_id: kid,
          },
        });
        if (keyword_device) {
          res.status(200).json({ msg: "deleted", isDleted: true });
        } else {
          res.status(200).json({ msg: "Cannot delete", isDleted: false });
        }
      } else {
        res.status(200).json({ msg: "Cannot delete", isDleted: false });
      }
    });
  }
  public get router() {
    return this._router;
  }
}
