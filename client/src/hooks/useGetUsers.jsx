import { useCallback } from "react"

export const useGetUsers = () => {
    return useCallback(() => fetch('http://localhost:3008/').then((response) => response.json()), [])
}