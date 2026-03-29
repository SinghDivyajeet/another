import { useState, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { Device } from "../types";

export function useDevices(showToast: (msg: string, type?: "error" | "info") => void) {
  const [devices, setDevices] = useState<Device[]>([]);

  const refreshDevices = useCallback(async () => {
    try {
      const devs = await invoke<Device[]>("list_devices");
      setDevices(devs.filter((d) => d.state === "device"));
    } catch (e) {
      showToast(`${e}`);
    }
  }, [showToast]);

  useEffect(() => {
    refreshDevices();
    const interval = setInterval(refreshDevices, 3000);
    return () => clearInterval(interval);
  }, [refreshDevices]);

  return { devices, refreshDevices };
}
