import {
	Button,
	Container,
	Group,
	Text,
	Title,
	createStyles,
	rem,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
	root: {
		paddingTop: rem(80),
		paddingBottom: rem(80),
	},

	label: {
		textAlign: "center",
		fontWeight: 900,
		fontSize: rem(220),
		lineHeight: 1,
		marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[4]
				: theme.colors.gray[2],

		[theme.fn.smallerThan("sm")]: {
			fontSize: rem(120),
		},
	},

	title: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		textAlign: "center",
		fontWeight: 900,
		fontSize: rem(38),

		[theme.fn.smallerThan("sm")]: {
			fontSize: rem(32),
		},
	},

	description: {
		maxWidth: rem(500),
		margin: "auto",
		marginTop: theme.spacing.xl,
		marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
	},
}));

const Page500 = () => {
	const { classes } = useStyles();

	return (
		<Container className={classes.root}>
			<div className={classes.label}>500</div>
			<Title className={classes.title}>Something bad just happened...</Title>
			<Text
				color="dimmed"
				size="lg"
				align="center"
				className={classes.description}
			>
				Our servers could not handle your request. Don't worry, our development
				team was already notified. Try refreshing the page.
			</Text>
			<Group position="center">
				<Button
					onClick={() => window.location.reload()}
					variant="subtle"
					size="md"
				>
					Refresh the page
				</Button>
			</Group>
		</Container>
	);
};

export default Page500;
