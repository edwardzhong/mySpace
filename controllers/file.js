
exports.uploadFile=async function(ctx,next){
	let form=ctx.request.body;
	ctx.body=await {
		status:0,
		ret:'success'
	};
};