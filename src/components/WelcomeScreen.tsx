import {
  DevicePhoneMobileIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
  SignalIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import type { Device, ThemePreference } from "../types";
import appIcon from "../assets/icon.png";

interface WelcomeScreenProps {
  devices: Device[];
  connectingSerial: string | null;
  themePref: ThemePreference;
  onCycleTheme: () => void;
  onOpenSettings: () => void;
  onRefreshDevices: () => void;
  onConnectDevice: (device: Device) => void;
}

function truncateSerial(s: string) {
  return s.length > 16 ? s.slice(0, 6) + "..." + s.slice(-4) : s;
}

export function WelcomeScreen({
  devices,
  connectingSerial,
  themePref,
  onCycleTheme,
  onOpenSettings,
  onRefreshDevices,
  onConnectDevice,
}: WelcomeScreenProps) {
  return (
    <div className="welcome">
      <div className="window-drag" data-tauri-drag-region>
        <div className="toolbar-actions">
          <button className="toolbar-btn" onClick={onCycleTheme} title={themePref === "light" ? "Light" : themePref === "dark" ? "Dark" : "System"}>
            {themePref === "light" ? <SunIcon /> : themePref === "dark" ? <MoonIcon /> : <ComputerDesktopIcon />}
          </button>
          <button className="toolbar-btn" onClick={onOpenSettings} title="Settings">
            <Cog6ToothIcon />
          </button>
        </div>
      </div>
      <div className="welcome-header">
        <img src={appIcon} alt="Another" className="welcome-logo" />
        <h1 className="welcome-title">Another</h1>
      </div>
      <p className="welcome-subtitle">Android screen mirroring and control</p>

      <div className="device-list">
        <div className="device-list-header">
          <span className="device-list-title">
            {devices.length > 0 ? `${devices.length} device${devices.length > 1 ? "s" : ""} found` : "Searching..."}
          </span>
          <button className="device-list-refresh" onClick={onRefreshDevices}>
            <ArrowPathIcon /> Refresh
          </button>
        </div>

        {devices.length === 0 ? (
          <div className="device-empty">
            <SignalIcon />
            <p>No devices detected.<br />Connect your Android via USB and enable USB debugging.</p>
          </div>
        ) : (
          devices.map((d) => (
            <div
              key={d.serial}
              className="device-card"
              onClick={() => !connectingSerial && onConnectDevice(d)}
            >
              <div className="device-card-icon">
                <DevicePhoneMobileIcon />
              </div>
              <div className="device-card-info">
                <div className="device-card-name">{d.model}</div>
                <div className="device-card-serial">{truncateSerial(d.serial)}</div>
              </div>
              <div className="device-card-arrow">
                {connectingSerial === d.serial ? <div className="spinner-sm" /> : <ChevronRightIcon />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
