import React ,{Component} from 'react'
import PropTypes from 'prop-types'

const TrashArticle=({aId,title,content,recoverArticle,deleteArticle})=>(
	<article>
		<div className="title-wrap">
			<h3 id="trashTitle" className="trash-title">{title||'无标题文章'}</h3>
			<button id="recover" className="btn-recover" onClick={()=>recoverArticle(aId)}>恢复</button>
			&nbsp;&nbsp;
			<button id="rDelete" className="btn-delete" onClick={()=>deleteArticle(aId,title||'无标题文章')}>彻底删除</button>
		</div>
		<div style={{height: 100+'px'}}></div>
		<div id="trashContent" className="trash-content">{content}</div>
	</article>
)

TrashArticle.propTypes = {
	aId: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	recoverArticle: PropTypes.func.isRequired,
	deleteArticle: PropTypes.func.isRequired
}

export default TrashArticle