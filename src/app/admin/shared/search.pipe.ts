import {Pipe, PipeTransform} from "@angular/core";
import { Post } from 'src/app/shared/intrerfaces';

@Pipe({
  name: 'searchPosts'
})
export class SearchPipe implements PipeTransform {
  transform(posts: Post[],search=''):Post[]{
    if(!search.trim()){
      return posts
    }
    return posts.filter((post)=>{
      console.log(post.title.toLowerCase().includes(search.toLowerCase()))
      return post.title.toLowerCase().includes(search.toLowerCase())
    })
  }
}
