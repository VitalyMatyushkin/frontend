/**
 * Created by vitaly on 06.12.17.
 */

export interface Tournament {
    createdAt: string
    endTime: string
    id: string
    link: string
    name: string
    photos: Photo[]
    schoolId: string
    sport: any
    sportId: string
    startTime: string
    updatedAt: string
}

interface Photo {
    id: string,
    picUrl: string,
    accessPreset: string
}
