interface IProps {
	description: string;
	className?: string;
}

function ProductDescription({ description, className = "" }: IProps) {
	return (
		<div className={className}>
			<div dangerouslySetInnerHTML={{ __html: description }} />
		</div>
	);
}

export default ProductDescription;
