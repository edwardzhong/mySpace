import React ,{Component} from 'react'
import PropTypes from 'prop-types'

const TrashList=({list,selectArticle})=>(
	<ul className="tArticle-list">
	{
		list.map((item,index)=>
			<li key={item.id} className={item.isSelect?'active':''} onClick={()=>selectArticle(item.id)}>
				<i className="fa fa-file-text"></i>
				<span>{item.days||0}天后清除</span>
				<p>{item.title||'无标题文章'}</p>
			</li>
		)
	}
	</ul>
)

TrashList.propTypes = {
	list: PropTypes.array.isRequired,
	selectArticle: PropTypes.func.isRequired
}

export default TrashList
