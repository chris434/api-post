import { useState } from 'react'

export default async function useFetch() {
    try {
        const res = await fetchData()
    } catch (error) {

    }
    return []
}