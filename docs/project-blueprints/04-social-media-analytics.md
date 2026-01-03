# Social Media Analytics Platform Blueprint

## Overview
Analytics platform for social media managers to track engagement, growth, and content performance across platforms.

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Charts**: Recharts (line, bar, pie, area charts)
- **Backend**: Lovable Cloud (Supabase)
- **Data**: Mock data or optional API integrations

---

## Features

### 1. Dashboard Overview
- **Key Metrics Cards**: Followers, Engagement Rate, Reach, Impressions
- **Growth Chart**: Follower growth over time
- **Engagement Trends**: Likes, comments, shares over time
- **Top Performing Posts**: Best content by engagement
- **Platform Breakdown**: Performance by platform (pie chart)

### 2. Platform Analytics
- **Individual Platform Views**: Instagram, Twitter, LinkedIn, Facebook, TikTok, YouTube
- **Platform-specific Metrics**: Views for YouTube, Retweets for Twitter, etc.
- **Comparison Mode**: Compare metrics across platforms

### 3. Content Analytics
- **Post Performance Table**: All posts with metrics
- **Content Type Breakdown**: Images, videos, carousels, text
- **Best Posting Times**: Heatmap of engagement by day/hour
- **Hashtag Analysis**: Most effective hashtags

### 4. Audience Insights
- **Demographics**: Age, gender, location breakdown
- **Follower Growth**: New vs lost followers
- **Active Times**: When audience is most active
- **Top Followers**: Most engaged followers

### 5. Reports & Export
- **Date Range Selection**: Custom date ranges
- **PDF Export**: Generate reports
- **CSV Export**: Raw data export
- **Scheduled Reports**: Weekly/monthly emails (optional)

### 6. Account Management
- **Multiple Accounts**: Manage multiple social profiles
- **Platform Connections**: OAuth connections (optional)
- **Team Access**: Share with team members

---

## Database Schema

```sql
-- Social accounts/profiles
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'instagram', 'twitter', 'linkedin', etc.
  account_name TEXT NOT NULL,
  account_handle TEXT,
  profile_image_url TEXT,
  is_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily metrics snapshots
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  website_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, date)
);

-- Individual posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform_post_id TEXT,
  content TEXT,
  media_type TEXT, -- 'image', 'video', 'carousel', 'text'
  media_url TEXT,
  posted_at TIMESTAMPTZ,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  hashtags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audience demographics
CREATE TABLE audience_demographics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  age_13_17 DECIMAL(5,2) DEFAULT 0,
  age_18_24 DECIMAL(5,2) DEFAULT 0,
  age_25_34 DECIMAL(5,2) DEFAULT 0,
  age_35_44 DECIMAL(5,2) DEFAULT 0,
  age_45_54 DECIMAL(5,2) DEFAULT 0,
  age_55_plus DECIMAL(5,2) DEFAULT 0,
  gender_male DECIMAL(5,2) DEFAULT 0,
  gender_female DECIMAL(5,2) DEFAULT 0,
  gender_other DECIMAL(5,2) DEFAULT 0,
  top_countries JSONB DEFAULT '[]',
  top_cities JSONB DEFAULT '[]',
  UNIQUE(account_id, date)
);

-- Indexes
CREATE INDEX idx_daily_metrics_account ON daily_metrics(account_id);
CREATE INDEX idx_daily_metrics_date ON daily_metrics(date);
CREATE INDEX idx_posts_account ON posts(account_id);
CREATE INDEX idx_posts_posted_at ON posts(posted_at);
```

### RLS Policies
```sql
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_demographics ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users manage their accounts" ON social_accounts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view their metrics" ON daily_metrics
  FOR ALL TO authenticated
  USING (
    account_id IN (
      SELECT id FROM social_accounts WHERE user_id = auth.uid()
    )
  );

-- Similar for posts and demographics...
```

---

## Pages & Routes

```
/auth                 - Login/Signup
/                     - Dashboard overview
/platforms            - All platforms overview
/platforms/:platform  - Single platform analytics
/content              - Content/posts analytics
/content/:id          - Single post details
/audience             - Audience insights
/reports              - Reports & export
/accounts             - Manage social accounts
/settings             - User settings
```

---

## UI Components

1. **MetricCard** - Large metric with trend indicator
2. **GrowthChart** - Area chart for follower growth
3. **EngagementChart** - Multi-line chart for engagement
4. **PlatformCard** - Platform overview with key metrics
5. **PostCard** - Post preview with metrics
6. **PostsTable** - Sortable posts data table
7. **HeatmapChart** - Best posting times heatmap
8. **DemographicsChart** - Pie/bar charts for demographics
9. **DateRangePicker** - Select analysis period
10. **PlatformSelector** - Switch between platforms
11. **CompareToggle** - Enable comparison mode

---

## Chart Examples

### Follower Growth Chart
```tsx
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={growthData}>
    <defs>
      <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Area 
      type="monotone" 
      dataKey="followers" 
      stroke="#6366f1" 
      fill="url(#colorFollowers)" 
    />
  </AreaChart>
</ResponsiveContainer>
```

### Engagement by Platform (Pie)
```tsx
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={platformData}
      dataKey="engagement"
      nameKey="platform"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {platformData.map((entry, index) => (
        <Cell key={index} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

---

## Sample Data Generator

```sql
-- Create sample account
INSERT INTO social_accounts (user_id, platform, account_name, account_handle)
VALUES 
  (auth.uid(), 'instagram', 'My Instagram', '@myhandle'),
  (auth.uid(), 'twitter', 'My Twitter', '@myhandle'),
  (auth.uid(), 'linkedin', 'My LinkedIn', 'myprofile');

-- Generate 30 days of sample metrics
INSERT INTO daily_metrics (account_id, date, followers, impressions, reach, likes, comments, shares, engagement_rate)
SELECT 
  sa.id,
  date_trunc('day', now() - (n || ' days')::interval)::date,
  10000 + (random() * 100)::int * n, -- Growing followers
  (random() * 50000 + 10000)::int,
  (random() * 30000 + 5000)::int,
  (random() * 2000 + 500)::int,
  (random() * 200 + 50)::int,
  (random() * 100 + 20)::int,
  (random() * 5 + 2)::decimal(5,2)
FROM social_accounts sa
CROSS JOIN generate_series(0, 29) n
WHERE sa.user_id = auth.uid();

-- Generate sample posts
INSERT INTO posts (account_id, content, media_type, posted_at, likes, comments, shares, impressions, hashtags)
SELECT 
  sa.id,
  'Sample post content #' || n,
  (ARRAY['image', 'video', 'carousel', 'text'])[floor(random() * 4 + 1)],
  now() - (n || ' days')::interval,
  (random() * 1000 + 100)::int,
  (random() * 50 + 5)::int,
  (random() * 30 + 2)::int,
  (random() * 10000 + 1000)::int,
  ARRAY['#socialmedia', '#marketing', '#growth']
FROM social_accounts sa
CROSS JOIN generate_series(1, 20) n
WHERE sa.user_id = auth.uid();
```

---

## Key Implementation Notes

1. **Start with mock data** - Real API integration is complex
2. **Use Recharts** for all visualizations (already in Lovable)
3. **Date range picker** is essential for analytics
4. **Comparison features** add great value
5. **Export to CSV** is easy to implement
6. **PDF export** can use libraries like jsPDF or html2canvas

---

## Optional: Real API Integration

For real data, you'd need:
- **Instagram/Facebook**: Meta Graph API (requires app review)
- **Twitter/X**: Twitter API v2 (paid tiers)
- **LinkedIn**: LinkedIn Marketing API (requires partnership)
- **YouTube**: YouTube Data API (free with limits)
- **TikTok**: TikTok API (limited access)

For a portfolio piece, **mock data works perfectly** and demonstrates your skills without API complexity.

---

## Estimated Build Time
- **Dashboard with Mock Data**: 3-4 hours with Lovable
- **Full Analytics Platform**: 6-8 hours with Lovable
- **With Real API Integration**: 15-20+ hours (complex OAuth flows)
