package com.intern.server.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.intern.server.model.Acronym;

@Mapper
public interface AcronymMapper {

	@Select("select count(*) from acronym")
	Integer countAllAcronym();
	
	@Select("select count(acronym) from acronym WHERE "
			+ "acronym LIKE '%${acronym}%' "
			+ "OR full_term LIKE '%${acronym}%' "
			+ "OR remark LIKE '%${acronym}%' ")
	Integer countAllSearchedAcronym(String acronym);
	
	@Select("select count(acronym) from acronym WHERE language LIKE '%${language}%'")
	Integer countAllSearchedLanguage(String language);
	
	@Select("select * from acronym WHERE acronym LIKE '%${acronym}%' OFFSET ${offset} rows fetch next ${limit} rows only")
	List<Acronym> searchForAcronym(String acronym, Number offset, Number limit);
	
	@Select("select * from acronym WHERE "
			+ "acronym LIKE '%${search}%' "
			+ "OR full_term LIKE '%${search}%' "
			+ "OR remark LIKE '%${search}%' "
			+ "OFFSET ${offset} rows fetch next ${limit} rows only")
	List<Acronym> search(String search, Number offset, Number limit);
	
	@Select("select * from acronym WHERE "
			+ "language LIKE '${search}' "
			+ "OFFSET ${offset} rows fetch next ${limit} rows only")
	List<Acronym> searchLanguage(String search, Number offset, Number limit);

	@Select("select * from acronym OFFSET ${offset} rows fetch next ${limit} rows only")
	List<Acronym> findPage(Number offset, Number limit);
	
	@Delete("Delete from acronym where ID = #{id}")
	void remove(Number id);
	
	//@Select("select * from testing where ID = #{id}")
	//Acronym findById(Number id);

	@Insert("insert into acronym (ACRONYM,FULL_TERM,REMARK,LANGUAGE,CREATOR) Values (#{acronym},#{full_term},#{remark},#{language},#{creator})")
	void addAcronym(String acronym, String full_term, String remark, String language, String creator);
	
	
	@Update("Update acronym set ACRONYM = #{acronym}, FULL_TERM = #{full_term}, REMARK = #{remark} where ID=#{id}")
	void updateAcronym(String acronym, String full_term, String remark, Number id);
	
}
