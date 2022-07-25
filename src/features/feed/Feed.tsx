import { Avatar, Card, CardContent, CardHeader, ImageList, ImageListItem, List, ListItem, ListItemText, ListSubheader, Typography } from "@mui/material";
import { useAppSelector } from "../../common/hooks";
import { Feed as Model, FeedType } from "../../common/utils/model";

interface FeedProps {
    title?: string;
    filter?: (post: Model, index: number, posts: Model[]) => Model[] | any;
}

function Feed({ title = "All posts", filter = (post, index, posts) => posts }: FeedProps) {
    const posts = useAppSelector((state) => state.feed.posts);
    return <List subheader={<ListSubheader sx={(theme) => ({ background: theme.palette.background.paper })}>
        {title}
    </ListSubheader>}>
        {posts.filter(filter).map((e, i) => <Card elevation={0}
            sx={(theme) => ({
                background: theme.palette.background.default,
                mb: 2
            })}>
            <CardHeader
                avatar={
                    <Avatar src={e.author.avatar} alt="U" />
                }
                title={e.author.name}
                subheader={e.date}
                action={
                    <Typography color="text.secondary" variant="caption" sx={{ mr: 1 }}>{e.type === FeedType.POST ? "Post" : "Activity"}</Typography>
                }
            />
            <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" color="text.secondary">{e.content}</Typography>
                {e.images.length > 0 && <ImageList sx={(theme) => ({
                    pt: 2
                })}>
                    {e.images.map((img, i) => <ImageListItem key={i}>
                        <img src={img} alt={e.content} loading="lazy" />
                    </ImageListItem>)}
                </ImageList>}
            </CardContent>
        </Card>)}
    </List>;
}

export default Feed;