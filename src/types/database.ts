export type UserProfile = {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
    created_at: string
}

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'archived'

export type Campaign = {
    id: string
    user_id: string
    company_id: string | null
    title: string
    description: string | null
    status: CampaignStatus
    created_at: string
    updated_at: string
}

export type VideoAdStatus = 'draft' | 'active' | 'paused' | 'archived'

export type VideoAd = {
    id: string
    user_id: string
    campaign_id: string
    title: string
    video_url: string
    description: string | null
    status: VideoAdStatus
    play_time_minutes: number
    created_at: string
    updated_at: string
}

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: UserProfile
                Insert: Omit<UserProfile, 'created_at'>
                Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>
            }
            campaigns: {
                Row: Campaign
                Insert: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Campaign, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
            }
            video_ads: {
                Row: VideoAd
                Insert: Omit<VideoAd, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<VideoAd, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
            }
        }
    }
}
