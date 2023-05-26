import { useSwitchNetwork } from "wagmi"

export const useNetwork = () => {
    const { switchNetwork } = useSwitchNetwork();
    
    return {
        switchNetwork
    }
}