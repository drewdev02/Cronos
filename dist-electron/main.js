import { app as c, BrowserWindow as I, nativeImage as g, Tray as R, Menu as S, ipcMain as f } from "electron";
import { fileURLToPath as P } from "node:url";
import s from "node:path";
const h = s.dirname(P(import.meta.url));
process.env.APP_ROOT = s.join(h, "..");
const v = process.env.VITE_DEV_SERVER_URL, j = s.join(process.env.APP_ROOT, "dist-electron"), C = s.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = v ? s.join(process.env.APP_ROOT, "public") : C;
let e, r = null, m = !1, i = null;
function E() {
  f.on("timer-started", (o, t) => {
    i = {
      id: t.id,
      title: t.title,
      startTime: t.startTime,
      totalTime: t.totalTime
    }, T(!0);
    const n = Date.now() - t.startTime, u = t.totalTime + n, w = _(u), y = `${t.title} - ${w}`;
    d(y), l || k();
  }), f.on("timer-paused", () => {
    i = null, d("Cronos"), T(!1), b();
  }), f.on("timer-stopped", () => {
    i = null, d("Cronos"), T(!1), b();
  }), f.on("timer-reset", () => {
    i = null, d("Cronos"), T(!1), b();
  });
}
function _(o) {
  const t = Math.floor(o / 1e3), a = Math.floor(t / 3600), n = Math.floor(t % 3600 / 60), u = t % 60;
  return a > 0 ? `${a.toString().padStart(2, "0")}:${n.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}` : `${n.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}`;
}
function M() {
  const o = g.createFromNamedImage("NSImageNameStopwatch", [16, 16]);
  r = new R(o), r.setToolTip("Cronos - Timer App"), d("Cronos");
  const t = S.buildFromTemplate([
    {
      label: "Mostrar aplicación",
      click: () => {
        e ? (e.show(), e.focus()) : p();
      }
    },
    {
      label: "Pausar timer activo",
      id: "pause-timer",
      enabled: !1,
      click: () => {
        e == null || e.webContents.send("tray-pause-timer");
      }
    },
    {
      label: "Detener timer activo",
      id: "stop-timer",
      enabled: !1,
      click: () => {
        e == null || e.webContents.send("tray-stop-timer");
      }
    },
    { type: "separator" },
    {
      label: "Salir",
      click: () => {
        m = !0, c.quit();
      }
    }
  ]);
  r.setContextMenu(t), r.on("click", () => {
    e ? e.isVisible() ? e.hide() : (e.show(), e.focus()) : p();
  });
}
function d(o = "Cronos") {
  r && r.setTitle(o);
}
function T(o) {
  if (!r) return;
  const t = S.buildFromTemplate([
    {
      label: "Mostrar aplicación",
      click: () => {
        e ? (e.show(), e.focus()) : p();
      }
    },
    {
      label: "Pausar timer activo",
      id: "pause-timer",
      enabled: o,
      click: () => {
        e == null || e.webContents.send("tray-pause-timer");
      }
    },
    {
      label: "Detener timer activo",
      id: "stop-timer",
      enabled: o,
      click: () => {
        e == null || e.webContents.send("tray-stop-timer");
      }
    },
    { type: "separator" },
    {
      label: "Salir",
      click: () => {
        m = !0, c.quit();
      }
    }
  ]);
  r.setContextMenu(t);
}
let l = null;
function k() {
  l && clearInterval(l), l = setInterval(() => {
    if (i) {
      const t = Date.now() - i.startTime, a = i.totalTime + t, n = _(a), u = `${i.title} - ${n}`;
      d(u);
    }
  }, 1e3);
}
function b() {
  l && (clearInterval(l), l = null);
}
function p() {
  e = new I({
    width: 1200,
    height: 800,
    icon: s.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: s.join(h, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !0
    }
  }), e.on("close", (o) => {
    if (!m)
      return o.preventDefault(), e == null || e.hide(), !1;
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), e.webContents.on("did-fail-load", (o, t, a, n) => {
    console.error("Failed to load:", t, a, n);
  }), v ? (e.loadURL(v), e.webContents.openDevTools()) : e.loadFile(s.join(C, "index.html"));
}
c.on("window-all-closed", () => {
  process.platform !== "darwin" && (m = !0, c.quit(), e = null);
});
c.on("before-quit", () => {
  m = !0;
});
c.on("activate", () => {
  I.getAllWindows().length === 0 && p();
});
c.whenReady().then(() => {
  p(), M(), E();
});
export {
  j as MAIN_DIST,
  C as RENDERER_DIST,
  v as VITE_DEV_SERVER_URL
};
