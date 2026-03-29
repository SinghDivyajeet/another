import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { Settings } from "./types";
import { PRESETS } from "./types";
import { useTheme } from "./hooks/useTheme";
import { useToasts } from "./hooks/useToasts";
import { useDevices } from "./hooks/useDevices";
import { useConnection } from "./hooks/useConnection";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { MirrorScreen } from "./components/MirrorScreen";
import { SettingsDialog } from "./components/SettingsDialog";
import { ToastContainer } from "./components/ToastContainer";
import "./App.css";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Settings>(PRESETS.balanced);
  const [activePreset, setActivePreset] = useState("balanced");

  const { themePref, setThemePref, cycleTheme } = useTheme();
  const { toasts, showToast } = useToasts();
  const { devices, refreshDevices } = useDevices(showToast);

  const takeScreenshot = useCallback(async () => {
    try {
      const base64 = await invoke<string>("take_screenshot");
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${base64}`;
      link.download = `screenshot-${Date.now()}.png`;
      link.click();
      showToast("Screenshot saved", "info");
    } catch (e) {
      showToast(`Screenshot failed: ${e}`);
    }
  }, [showToast]);

  const {
    screen,
    connectedDevice,
    connecting,
    deviceSize,
    canvasRef,
    isMouseDown,
    connectToDevice,
    disconnect,
    scheduleReconnect,
    pressButton,
    handleCanvasMouseEvent,
    handleWheel,
    handleKeyDown,
  } = useConnection({
    settings,
    showToast,
    takeScreenshot,
    setShowSettings: (fn) => setShowSettings(fn),
    setThemePref: (fn) => setThemePref(fn),
  });

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    setActivePreset("");
    if (connectedDevice) scheduleReconnect(next);
  };

  const applyPreset = (name: string) => {
    const next = PRESETS[name];
    setSettings(next);
    setActivePreset(name);
    if (connectedDevice) scheduleReconnect(next);
  };

  return (
    <>
      {screen === "welcome" ? (
        <WelcomeScreen
          devices={devices}
          connecting={connecting}
          themePref={themePref}
          onCycleTheme={cycleTheme}
          onOpenSettings={() => setShowSettings(true)}
          onRefreshDevices={refreshDevices}
          onConnectDevice={(d) => connectToDevice(d, settings)}
        />
      ) : connectedDevice ? (
        <MirrorScreen
          connectedDevice={connectedDevice}
          connecting={connecting}
          deviceSize={deviceSize}
          canvasRef={canvasRef}
          isMouseDown={isMouseDown}
          onPressButton={pressButton}
          onTakeScreenshot={takeScreenshot}
          onToggleSettings={() => setShowSettings((s) => !s)}
          onDisconnect={disconnect}
          onCanvasMouseEvent={handleCanvasMouseEvent}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
        />
      ) : null}

      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        activePreset={activePreset}
        onApplyPreset={applyPreset}
        onUpdateSetting={updateSetting}
      />
      <ToastContainer toasts={toasts} />
    </>
  );
}

export default App;
