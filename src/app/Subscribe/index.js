import React, { useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";

export default function Subscribe({
  senderAddress,
  onSubscribe,
  onUnsubscribe,
  onError,
  env,
  label = "Subscribe with your wallet",
}) {
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for subscription status
  const [subscriptionStatus, setSubscriptionStatus] = useState(label);
  // State for consent log
  const [consentLog, setConsentLog] = useState("");
  // State for sender address

  const styles = {
    SubscribeButtonContainer: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      borderRadius: "5px",
      textAlign: "center",
      alignItems: "center",
    },
    SubscribeButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px 20px",
      borderRadius: "5px",
      marginBottom: "2px",
      textAlign: "left",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      fontWeight: "bold",
      color: "#333333",
      backgroundColor: "#ededed",
      border: "none",
      fontSize: "12px",
    },
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        return provider.getSigner();
      } catch (error) {
        console.error("User rejected request", error);
      }
    } else {
      console.error("Metamask not found");
    }
  };

  // Define the handleClick function
  const handleClick = async () => {
    try {
      // Set loading to true
      setLoading(true);
      // Get the subscriber
      let wallet = await connectWallet();
      let client = await Client.create(wallet, { env: env });

      // Refresh the consent list to make sure your application is up-to-date with the
      await client.contacts.refreshConsentList();

      // Get the consent state of the subscriber
      let state = client.contacts.consentState(senderAddress);

      // If the state is unknown or blocked, allow the subscriber
      if (state === "unknown" || state === "denied") {
        state = "allowed";
        await client.contacts.allow([senderAddress]);
        if (typeof onSubscribe === "function")
          onSubscribe(client.address, state);
      } else if (state === "allowed") {
        state = "denied";
        await client.contacts.deny([senderAddress]);
        // If the state is allowed, block the subscriber
        if (typeof onUnsubscribe === "function")
          onUnsubscribe(client.address, state);
      }

      //Print the whole list
      console.log(await client.contacts.refreshConsentList());
      console.log(await client.contacts.loadConsentList());

      // Set the subscription label
      setSubscriptionStatus("Consent State: " + state);

      // Set loading to false
      setLoading(false);
    } catch (error) {
      // If onError function exists, call it with the error
      if (typeof onError === "function") onError(error);
      // Log the error
      console.log(error);
    }
  };

  return (
    <div
      style={styles.SubscribeButtonContainer}
      className={`Subscribe ${loading ? "loading" : ""}`}
    >
      <small>Sender address: {senderAddress}</small>
      <button style={styles.SubscribeButton} onClick={handleClick}>
        {loading ? "Loading... " : subscriptionStatus}
      </button>
    </div>
  );
}
