"use client";

import React, { useEffect } from "react";
import {
  AuthCoreEvent,
  type SocialAuthType,
  getLatestAuthType,
  isSocialAuthType,
  particleAuth,
} from "@particle-network/auth-core";
import { useConnect as useParticleConnect } from "@particle-network/auth-core-modal";
import { useConnect, useDisconnect } from "wagmi";
import { particleWagmiWallet } from "~~/services/particleWallet/particleWagmiWallet";

const ParticleConnectionHandler = ({ openConnectModal }: { openConnectModal: () => void }) => {
  const { connect } = useConnect();
  const { connectionStatus } = useParticleConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (connectionStatus === "connected" && isSocialAuthType(getLatestAuthType())) {
      connect({
        connector: particleWagmiWallet({ socialType: getLatestAuthType() as SocialAuthType }),
      });
    }
    const onDisconnect = () => disconnect();
    particleAuth.on(AuthCoreEvent.ParticleAuthDisconnect, onDisconnect);
    return () => particleAuth.off(AuthCoreEvent.ParticleAuthDisconnect, onDisconnect);
  }, [connect, connectionStatus, disconnect]);

  return (
    <button className="btn btn-primary btn-sm" onClick={openConnectModal} type="button">
      Connect Wallet
    </button>
  );
};

export default ParticleConnectionHandler;
