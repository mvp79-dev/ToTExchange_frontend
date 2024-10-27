interface IProps {
	additionalInfo: string;
	className?: string;
}

function AdditionalInfo({ additionalInfo, className = "" }: IProps) {
	return (
		<div className={className}>
			<div dangerouslySetInnerHTML={{ __html: additionalInfo }} />
		</div>
	);
}

export default AdditionalInfo;
